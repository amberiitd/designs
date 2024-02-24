package cricket_scoreboard.src.main.model;

import java.util.Arrays;
import java.util.stream.Stream;

import cricket_scoreboard.src.main.constant.DeliveryType;
import cricket_scoreboard.src.main.constant.Play;
import cricket_scoreboard.src.main.constant.Run;

public class TeamPlay {
    public String teamId;

    // game info
    public PlayerScore[] players;
    public Play play;

    // for play = "FIELDING"
    public PlayerScore playerOnDelivery;


    // for play = "BATTING"
    public int runs=0;
    public int wicketLeft;
    public PlayerScore playerOnStrike;
    public PlayerScore playerOffStrike;

    public boolean lastOverConcluded = true;

    public TeamPlay(Team team, Play play){
        this.play = play;
        this.teamId = team.id;
        this.players = (PlayerScore[]) Arrays.stream(team.players).map(player -> new PlayerScore()).toArray();
        if (play.equals(Play.BATTING)){
            this.playerOnStrike = this.players[0];
            this.playerOffStrike= this.players[1];
            this.wicketLeft = team.players.length;
        }else{
            this.playerOnDelivery = this.players[0];
        }
    }

    public void playNextBall(DeliveryType ballType, Run nextRun){
        switch (ballType) {
            case DeliveryType.OK:
                
                break;

            case DeliveryType.WIDE:
                
                break;
            default:
                break;
        }

    }

    public void deliverNextBall(DeliveryType ballType, Run nextRun){

    }

    public void concludeOver(){

    }

}
