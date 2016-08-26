from django.conf.urls import url, include

from base import views as base_views
from rest_framework.routers import SimpleRouter

router = SimpleRouter(trailing_slash=False)
router.register(r'buildings', base_views.BuildingViewset)
router.register(r'units', base_views.UnitViewset)

urlpatterns = [
        url(r'^', include(router.urls)),
        url(r'', base_views.ProtectedDataView.as_view(),
            name='protected_data'),
]
