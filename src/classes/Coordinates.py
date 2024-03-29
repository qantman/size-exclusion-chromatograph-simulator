import json
class Coordinates():
    def __init__(self, path):
        self._path = path
    def get_coordinates(self):
        x_list = []
        y_list = []
        with open(self._path, "r") as jsObj:
            data = json.load(jsObj)
            key = list(data.keys())
        for i in range(len(data[key[0]])):
            x_list.append(data[key[0]][i]["vol"])
            y_list.append(data[key[0]][i]["curve"])
        self._coordinates = {"x": x_list, "y": y_list, "key":key[0]}
        return self._coordinates