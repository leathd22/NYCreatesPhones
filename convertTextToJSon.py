import csv
import json

def csv_to_json(csv_file, json_file):
    data = []
    with open(csv_file, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)

        for x in data:
            x.pop('None')
            x['Price'] = float(x['Price'])

    with open(json_file, mode='w', encoding='utf-8') as file:
           json.dump(data, file, indent=4)

csv_to_json('cellphonedata.txt', 'cellphonedata.json')
