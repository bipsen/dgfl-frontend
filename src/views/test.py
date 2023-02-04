players = {870: {'name': 'Bob'}, 435: {'name': 'Alice'}, 75: {'name': 'Ken'}}
selectedPlayers = [870, 75]
result = [{'id': player_id, **players[player_id]} for player_id in selectedPlayers]
print(result)