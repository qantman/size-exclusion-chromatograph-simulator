class Basis:
    def __init__(self):
        self.values = []
    def create_value(self):
        value = {}
        self.values.append(value)
    def get_value(self, number_value):
        return self.values[number_value]
    def set_value(self, number_value, value):
        self.values[number_value] = value