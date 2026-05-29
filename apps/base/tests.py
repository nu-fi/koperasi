from django.test import TestCase

class CoreSystemTests(TestCase):
    def test_admin_panel_loads(self):
        """
        Test that the Django admin page eventually returns a 200 HTTP status code.
        """
        # Notice we changed the URL to just '/admin/' and added follow=True
        response = self.client.get('/admin/', follow=True)
        
        # The final destination (the login page) should be a 200 OK
        self.assertEqual(response.status_code, 200)