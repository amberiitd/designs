package cricket_scoreboard.src.main.model;

import java.util.stream.IntStream;
import java.util.stream.Stream;

public class Team {
    public String id;
    public String name;
    public Player[] players;

    public Team(String id, String name, int numberOfPlayers) throws Exception{
        this.id = id;
        this.name = name;
        if (numberOfPlayers < 2){
            throw new Exception("requires at least two players");
        }
        this.players = (Player[]) IntStream.range(1, numberOfPlayers+1).mapToObj((num)-> new Player(num+id, "Player-"+num, id)).toArray();
    }
}
