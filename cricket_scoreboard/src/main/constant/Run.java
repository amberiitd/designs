package cricket_scoreboard.src.main.constant;

public class Run {
    public int value;
    public RunType type;

    public Run(int value) throws IllegalArgumentException {
        this.value = value;
        if ((0 <= value && value < 4)) {
            type = RunType.BTWN_THE_WCKTS;
        } else if (value == 4 || value == 6) {
            type = RunType.BTWN_THE_WCKTS;
        } else {
            throw new IllegalAccessError("Invalid run");
        }
    }
}
