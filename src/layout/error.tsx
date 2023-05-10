import { Button } from "antd";
import error from "../assets/error.svg";

function NotFound() {
  return (
    <div className="text-center bg-white h-full flex flex-col justify-center">
      <div className="inline-block">
        <img src={error} />
      </div>
      <div className="m-3 text-2xl text-black">出错啦！</div>
      <div className="m-3 text-gray-400">(404) 没有找到相关内容!</div>
      <div>
        <Button type="primary" onClick={() => history.back()}>返回</Button>
      </div>
    </div>
  )
}

export default NotFound