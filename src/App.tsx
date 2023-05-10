import React from 'react'
import { useRoutes } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { newRouters } from "./router";

function App() {
  // console.log(newRouters);
  const elements = useRoutes(newRouters)
  
  return elements
}


export default observer(App)
