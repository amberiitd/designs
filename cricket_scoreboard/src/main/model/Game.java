package cricket_scoreboard.src.main.model;

import cricket_scoreboard.src.main.constant.Play;

public class Game {
    public Ining[] inings;
    public int currentIning;
    public int[] deliveries;
    public boolean done = false;

    public String getScoreBoard() {
        return null;
    }

    public void build() {
        try {
            Team team1 = new Team("1", "Team-1", 2);
            Team team2 = new Team("2", "Team-2", 2);
            inings = new Ining[] {
                    new Ining(new TeamPlay(team1, Play.BATTING), new TeamPlay(team2, Play.FIELDING), 2),
                    new Ining(new TeamPlay(team1, Play.BATTING), new TeamPlay(team2, Play.FIELDING), 2)
            };
            currentIning = 0;
            deliveries = new int[]{
                1, 1, 1, 1, 1, 2
            };
        } catch (Exception error) {
            error.printStackTrace();
        }

    }

    public void start() {
        for (int i =0; i < deliveries.length && currentIning < inings.length; i++){
            inings[currentIning].processNextDelivery(deliveries[i]);
            if (inings[currentIning].done) currentIning++;
        }
        if (currentIning == inings.length) done = true;
    }
}
