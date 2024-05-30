from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer
from django.contrib.auth import authenticate, login
from .serializers import UserLoginSerializer, PasswordResetRequestSerializer, PasswordResetSerializer
from .models import Profile
from .serializers import ProfileSerializer
from django.shortcuts import get_object_or_404

class ProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class ProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserRegistrationSerializer

    def get(self, request, *args, **kwargs):
        return Response({"message": "GET request received."}, status=status.HTTP_200_OK)


class UserLoginView(generics.CreateAPIView):
    serializer_class = UserLoginSerializer

    def get(self, request, *args, **kwargs):
        return Response({"message": "GET request received."}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')

        try:
            profile = Profile.objects.get(email=email)
            if profile.password == password:
                return Response({"profile_id": profile.id}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        except Profile.DoesNotExist:
            return Response({"message": "Invalid email."}, status=status.HTTP_401_UNAUTHORIZED)

class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        security_answer = serializer.validated_data['security_answer']
        
        profile = get_object_or_404(Profile, email=email)
        
        if profile.security_answer == security_answer:
            return Response({"message": "Security answer is correct. Proceed to reset password."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid security answer."}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']
        security_answer = serializer.validated_data['security_answer']
        
        profile = get_object_or_404(Profile, email=email)
        
        if profile.security_answer == security_answer:
            profile.password = new_password
            profile.save()
            return Response({"message": "Password has been reset."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid security answer."}, status=status.HTTP_400_BAD_REQUEST)