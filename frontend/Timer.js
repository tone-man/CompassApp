import { Platform } from "react-native";
import BackgroundTimer from "react-native-background-timer";

class Timer {
  startTimer(callback, interval) {
    if (Platform.OS === "ios") {
      BackgroundTimer.start();
      this.timer = setInterval(callback, interval);
    } else {
      this.timer = BackgroundTimer.setInterval(callback, interval);
    }
  }

  stopTimer() {
    if (Platform.OS === "ios") {
      clearInterval(this.timer);
      BackgroundTimer.stop();
    } else {
      BackgroundTimer.clearInterval(this.timer);
    }
  }
}

export default new Timer();
