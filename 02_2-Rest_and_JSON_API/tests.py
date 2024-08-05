from unittest import TestCase, TestSuite, TextTestRunner
import unittest

from app import app
from models import db, Cupcake

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_test'
app.config['SQLALCHEMY_ECHO'] = False
app.config['TESTING'] = True

CUPCAKE_DATA = {
    "flavor": "TestFlavor",
    "size": "TestSize",
    "rating": 5,
    "image": "http://test.com/cupcake.jpg"
}

CUPCAKE_DATA_2 = {
    "flavor": "TestFlavor2",
    "size": "TestSize2",
    "rating": 10,
    "image": "http://test.com/cupcake2.jpg"
}


class CupcakeViewsTestCase(TestCase):
    """Tests for views of API."""

    def setUp(self):
        """Make demo data."""
        with app.app_context():
            Cupcake.query.delete()

        cupcake = Cupcake(**CUPCAKE_DATA)
        self.cupcake = cupcake

        with app.app_context():
            db.drop_all()
            db.session().expire_on_commit = False
            db.create_all()
            db.session.add(cupcake)
            db.session.commit()

    def test_01_list_cupcakes(self):
        with app.test_client() as client:
            resp = client.get("/api/cupcakes")
            self.assertEqual(resp.status_code, 200)
            
            data = resp.json
            self.assertEqual(data, {
                "cupcakes": [
                    {
                        "id": 1,
                        "flavor": "TestFlavor",
                        "size": "TestSize",
                        "rating": 5,
                        "image": "http://test.com/cupcake.jpg"
                    }
                ]
            })

    def test_02_get_cupcake(self):
        with app.test_client() as client:
            resp = client.get(f"/api/cupcakes/{self.cupcake.id}")
            self.assertEqual(resp.status_code, 200)

            data = resp.json
            self.assertEqual(data, {
                "cupcake": {
                    "id": self.cupcake.id,
                    "flavor": "TestFlavor",
                    "size": "TestSize",
                    "rating": 5,
                    "image": "http://test.com/cupcake.jpg"
                }
            })

    def test_03_get_cupcake_fail(self):
        with app.test_client() as client:
            url = "api/cupcakes/-1"
            resp = client.get(url)
            self.assertEqual(resp.status_code, 404)

    def test_04_create_cupcake(self):
        with app.test_client() as client:
            resp = client.post("/api/cupcakes", json=CUPCAKE_DATA_2)
            self.assertEqual(resp.status_code, 201)

            data = resp.json
            self.assertIsInstance(data['cupcake']['id'], int)
            del data['cupcake']['id']

            self.assertEqual(data, {
                "cupcake": {
                    "flavor": "TestFlavor2",
                    "size": "TestSize2",
                    "rating": 10,
                    "image": "http://test.com/cupcake2.jpg"
                }
            })

            self.assertEqual(Cupcake.query.count(), 2)

    def test_05_list_cupcakes(self):
        with app.test_client() as client:
            resp = client.post("api/cupcakes", json=CUPCAKE_DATA_2)
            self.assertEqual(resp.status_code, 201)

            data = resp.json
            self.assertIsInstance(data['cupcake']['id'], int)
            del data['cupcake']['id']

            resp = client.get("/api/cupcakes")
            self.assertEqual(resp.status_code, 200)

            data = resp.json
            self.assertEqual(data, {
                "cupcakes": [
                    {
                        "id": 1,
                        "flavor": "TestFlavor",
                        "size": "TestSize",
                        "rating": 5,
                        "image": "http://test.com/cupcake.jpg"
                    },
                    {
                        "id": 2,
                        "flavor": "TestFlavor2",
                        "size": "TestSize2",
                        "rating": 10,
                        "image": "http://test.com/cupcake2.jpg"
                    }
                ]
            })

    def test_06_get_cupcake(self):
        with app.test_client() as client:
            resp = client.post("/api/cupcakes", json=CUPCAKE_DATA_2)
            self.assertEqual(resp.status_code, 201)

            data = resp.json
            self.assertIsInstance(data['cupcake']['id'], int)
            del data['cupcake']['id']

            resp = client.get("/api/cupcakes/2")
            self.assertEqual(resp.status_code, 200)

            data = resp.json
            self.assertEqual(data, {
                "cupcake": {
                    "id": 2,
                    "flavor": "TestFlavor2",
                    "size": "TestSize2",
                    "rating": 10,
                    "image": "http://test.com/cupcake2.jpg"
                }
            })

    def test_07_delete_cupcake(self):
        with app.test_client() as client:
            resp = client.post("/api/cupcakes", json=CUPCAKE_DATA_2)
            self.assertEqual(resp.status_code, 201)

            data = resp.json
            self.assertIsInstance(data['cupcake']['id'], int)
            del data['cupcake']['id']

            resp = client.delete("/api/cupcakes/1")
            self.assertEqual(resp.status_code, 200)

            data = resp.json
            self.assertEqual(data, {"message": "Deleted"})

            self.assertEqual(Cupcake.query.count(), 1)

            resp = client.get("/api/cupcakes")
            self.assertEqual(resp.status_code, 200)

            data = resp.json
            self.assertEqual(data, {
                "cupcakes": [
                    {
                        "id": 2,
                        "flavor": "TestFlavor2",
                        "size": "TestSize2",
                        "rating": 10,
                        "image": "http://test.com/cupcake2.jpg"
                    }
                ]
            })

    #def test_06_update_cupcake(self):
    #    with app.test_client() as client:
    #        url = f"/api/cupcakes/{self.cupcake.id}"
    #        resp = client.patch(url, json=CUPCAKE_DATA)
#
    #        self.assertEqual(resp.status_code, 200)
#
    #        data = resp.json
    #        self.assertEqual(data,{
    #            "cupcake": {
    #                "id": self.cupcake.id,
    #                "flavor": "TestFlavor",
    #                "size": "TestSize",
    #                "rating": 5,
    #                "image": "http://test.com/cupcake.jpg"
    #            }
    #        })
#
    #        self.assertEqual(Cupcake.query.count(), 1)

    def tearDown(self):
        """Clean up fouled transactions."""
        with app.app_context():
            db.session.rollback()
