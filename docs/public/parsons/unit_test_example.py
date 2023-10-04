import unittest
import _answer

class ParsonsTestCase(unittest.TestCase):

    def test_add_to_0(self):
        self.assertTrue(hasattr(_answer, 'add_two'))
        self.assertEqual(2, _answer.add_two(0))

    def test_add_to_1(self):
        self.assertTrue(hasattr(_answer, 'add_two'))
        self.assertEqual(3, _answer.add_two(1))

    def test_add_to_10(self):
        self.assertTrue(hasattr(_answer, 'add_two'))
        self.assertEqual(12, _answer.add_two(10))
