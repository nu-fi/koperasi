from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Member, Token
from .serializers import MemberSerializer, TokenSerializer
from django.contrib.auth.models import User
from django.conf import settings
from datetime import datetime, timedelta
import uuid
from django.utils import timezone
import environ
import os
from settings.config.settings import BASE_DIR 
import hashlib


# def home(request):
#     return HttpResponse("Welcome to the Home Page FOR MEMBERS ONLY")

# def profile(request):
#     return HttpResponse("This is the Profile Page FOR MEMBERS ONLY")


environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

salt = env('SALT')

def mail_template(content, button_url, button_text):
    """
    Generates an HTML email template with the provided content, button URL, and button text.
    """
    return f"""<!DOCTYPE html>
            <html>
            <body style="text-align: center; font-family: "Verdana", serif; color: #000;">
                <div style="max-width: 600px; margin: 10px; background-color: #fafafa; padding: 25px; border-radius: 20px;">
                <p style="text-align: left;">{content}</p>
                <a href="{button_url}" target="_blank">
                    <button style="background-color: #444394; border: 0; width: 200px; height: 30px; border-radius: 6px; color: #fff;">{button_text}</button>
                </a>
                <p style="text-align: left;">
                    If you are unable to click the above button, copy paste the below URL into your address bar
                </p>
                <a href="{button_url}" target="_blank">
                    <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">{button_url}</p>
                </a>
                </div>
            </body>
            </html>"""

class ResetPasswordRequestView(APIView):
    """
    View to handle password reset requests.
    """
    def post(self, request, format=None):
        user_id = request.data['user_id']
        token = request.data['token']
        password = request.data['password']

        token_obj = Token.objects.filter(user__username=user_id, token=token, is_used=False, is_expired=False).order_by('-created_at').first()

        if token_obj.expired_at < timezone.now():
            token_obj.is_expired = True
            token_obj.save()
            return Response({
                "success": False,
                "message": "Password Reset Link has expired! Please request a new one."
                }, 
                status=status.HTTP_200_OK
            )
        elif token_obj is None or token != token_obj.token or token_obj.is_used or token_obj.is_expired:
            return Response({
                "success": False,
                "message": "Invalid Password Reset Link! Please request a new one."
                }, 
                status=status.HTTP_200_OK
            )
        else:
            token_obj.is_used = True
            hashed_password = make_password(password=password, salt=salt)
            ret_code = User.objects.filter(id=user_id).update(password=hashed_password)
            if ret_code:
                token_obj.save()
                return Response({
                    "success": True,
                    "message": "Password has been reset successfully! You can now login with your new password."
                    }, 
                    status=status.HTTP_200_OK
                )

class ForgotPasswordRequestView(APIView):
    """
    View to handle forgot password requests.
    """
    def post(self, request, format=None):
        try:
            user = User.objects.get(username=request.data['user_id'])
        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "User ID does not exist!"
                }, 
                status=status.HTTP_200_OK
            )
        email = request.data['email']
        user = User.objects.filter(email=email).first()
        created_at = timezone.now()
        expired_at = created_at + timedelta(hours=1)
        salt = uuid.uuid4().hex
        token = hashlib.sha256((str(user.id) + user.password + created_at.isoformat() + salt).encode('utf-8')).hexdigest()
        token_obj = {
            'user': user,
            'token': token,
            'created_at': created_at,
            'expired_at': expired_at,
            'is_used': False,
            'is_expired': False
        }

        seriliazer = TokenSerializer(data=token_obj)
        if seriliazer.is_valid():
            seriliazer.save()
            reset_link = f'{env("FRONTEND_URL")}/reset-password?user_id={user.id}&token={token}'
            subject = "Koperasi Syariah - Forgot Password Link Request"
            content = mail_template("We have received a request to reset your password. Please click the button below to reset your password.", reset_link , "Reset Password")
            send_mail(
                subject=subject,
                message=content,
                from_email=env('EMAIL_HOST_USER'),
                recipient_list=[email],
                html_message=content,
            )
            return Response({
                "success": True,
                "message": "Password reset link has been sent to your registered email address."
                }, 
                status=status.HTTP_200_OK
            )
        else:
            error_messages = ""
            for field, errors in seriliazer.errors.items():
                for error in errors:
                    error_messages += f"{field}: {error} "
            return Response({
                "success": False,
                "message": error_messages
                }, 
                status=status.HTTP_200_OK
            )

class RegisterView(APIView):
    """
    View to handle user registration.
    """
    def post(self, request, format=None):
        # request.data['password'] = make_password(password=request.data['password'], salt=salt)
        serializer = MemberSerializer(data=request.data)
        if serializer.is_valid():
            
            serializer.save()
            return Response({
                "success": True,
                "message": "You are now registered on Koperasi Syariah!"
                }, 
                status=status.HTTP_201_CREATED
            )
        else:
            error_messages = ""
            for field, errors in serializer.errors.items():
                for error in errors:
                    error_messages += f"{field}: {error} "
            return Response({
                "success": False,
                "message": error_messages
                }, 
                status=status.HTTP_200_OK
            )

class LoginView(APIView):
    """
    View to handle user login.
    """
    def post(self, request, format=None):
        email = request.data['email']
        password = request.data['password']
        # hashed_password = make_password(password=password, salt=salt)
        user = User.objects.filter(email=email).first()
        if user is None or not check_password(password, user.password):
            return Response({
                "success": False,
                "message": "Invalid Login Credentials! Please try again."
                }, 
                status=status.HTTP_200_OK
            )
        else:
            return Response({
                "success": True,
                "message": "Login successful!",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
                }, 
                status=status.HTTP_200_OK
            )

class DashboardView(APIView):
    """
    View to handle dashboard data retrieval.
    """
    def get(self, request, format=None):
        return Response({
            "success": True,
            "message": "Dashboard data retrieved successfully!"
            }, 
            status=status.HTTP_200_OK
        )