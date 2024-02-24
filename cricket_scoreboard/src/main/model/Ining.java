package cricket_scoreboard.src.main.model;

import cricket_scoreboard.src.main.constant.Play;

public class Ining {
    private int totalOvers;
    public Over[] overs;
    public int totalDeliveries;
    public int okDeliveries;
    public TeamPlay teamOnBatting;
    public TeamPlay teamOnFielding;
    public boolean done = false;
    public int remainingDeliveriesInCurrentOver;

    public Ining(TeamPlay team1, TeamPlay team2, int totalOvers) throws Exception{
        if (team1.play.equals(team2.play)) throw new Exception("play mode cannot be same for both teams");
        if (totalOvers < 0) throw new Exception("invalid total overs");
        if (team1.play.equals(Play.BATTING)){
            this.teamOnBatting = team1;
            this.teamOnFielding = team2;
        }else{
            this.teamOnBatting = team2;
            this.teamOnFielding = team1;
        }
        this.totalOvers = totalOvers;
    }

    public void processNextDelivery(int deliveryCode){
        
    }
}
