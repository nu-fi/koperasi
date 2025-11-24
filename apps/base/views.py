from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Home Page FOR EVERYONE")

def about(request):
    return HttpResponse("This is the About Page")

def contact(request):
    return HttpResponse("This is the Contact Page")

def services(request):
    return HttpResponse("This is the Services Page")