import { observable } from 'mobx';

class AppStore {
  @observable count = 0;

  resetTimer() {
    this.count = 0;
  }
}

export default AppStore;
