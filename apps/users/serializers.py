from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Token, Member
from django.db import transaction

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['id', 'user', 'token', 'created_at', 'expired_at', 'is_used', 'is_expired']

class MemberSerializer(serializers.ModelSerializer):
    """Serializer for Member model including nested User fields."""
    name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    user = serializers.StringRelatedField(read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)  

    class Meta:
        model = Member
        fields = [
            'id', 'user', 'member_id', 'name', 'email', 'password', 'status', 'date_joined', 'phone_number', 'address', 'birth_date', 'ktp_number', 'first_name', 'last_name'
        ]

        extra_kwargs = {
            'member_id': {'read_only': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def generate_username(self, name):
        base_username = name.lower().replace(" ", "_")
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        return username
    
    def create(self, validated_data):
        name = validated_data.pop('name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        username = self.generate_username(name)
        parts = name.split()
        first_name = parts[0]
        last_name = " ".join(parts[1:]) if len(parts) > 1 else ""

        with transaction.atomic():
            user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password
            )  
            member = Member.objects.create(user=user, **validated_data)
        return member
    