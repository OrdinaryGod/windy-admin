import CommonStore from "./common.Store";
import React from "react";

/**
 * 根store 所有的store需在此注册
 */
class RootStore {
  commonStore: CommonStore
  constructor() {
    this.commonStore = new CommonStore()
  }
}

const rootStore = new RootStore()

const context = React.createContext(rootStore)

const useStore = () => React.useContext(context)

export { useStore } 