from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Token, Member

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['id', 'user', 'token', 'created_at', 'expired_at', 'is_used', 'is_expired']

class MemberSerializer(serializers.ModelSerializer):
    """Serializer for Member model including nested User fields."""
    name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    user = serializers.StringRelatedField(read_only=True)  # To display the username instead of the user ID

    class Meta:
        model = Member
        fields = [
            'id', 'user', 'member_id', 'name', 'email', 'password', 'status', 'date_joined',
        ]

        extra_kwargs = {
            'member_id': {'read_only': True}
        }
    
    def create(self, validated_data):
        name = validated_data.pop('name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            username=name,
            first_name=name,
            email=email,
            password=password
        )
        member = Member.objects.create(user=user, **validated_data)
        return member
    # class UserSerializer(serializers.ModelSerializer):
    #     class Meta:
    #         model = User
    #         fields = ['id', 'username', 'email', 'first_name', 'last_name']