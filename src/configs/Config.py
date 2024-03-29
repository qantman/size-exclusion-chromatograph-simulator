from src.classes.Comboboxes import Comboboxes
from src.classes.Labels import Labels
from src.classes.Plot import Plot
class Configure():
    def __init__(self, root):
        self.configure = {
            "grid": [60, 60],
            "spans": [1, 1],
            "coords": {
                "coord_for_plot": [0, 0], 
                "coord_for_label1": [2, 40],
                "coord_for_combobox": [3, 40],
            },
            "filenames": [
                "5000_ПС_stnd",
                "10000_ПС_stnd", 
                "50000_ПС_stnd", 
                "100000_ПС_stnd", 
                "400000_ПС_stnd", 
                "1000000_ПС_stnd",
                "investigation-1",
                "investigation-2",
                "investigation-3",
                "investigation-4"
            ]   
        }
        self.root = root
        self.comboboxes = Comboboxes(self.root)
        self.labels = Labels(self.root)
        self.plot = Plot(self.root)
    def set_path(self, path):        
        self.plot.set_path(path)
    def set_configure(self):
        combobox = self.comboboxes.create_value(
            self.configure["filenames"],
            self.configure["coords"]["coord_for_combobox"],
            "nw"
        )
        combobox.bind("<<ComboboxSelected>>", self.plot.selected)
        self.plot.set_combobox(combobox)
        self.labels.create_value(
            "Выберете образец", 
            self.configure["coords"]["coord_for_label1"], 
            self.configure["spans"], 
            "nw"
        )