/**
 * 登录组件
 */

import imgUrl from "@/assets/windy-logo.svg"
import cloud from "@/assets/cloud.svg"
import { Input, Tabs, Button, Divider, Checkbox, InputRef } from 'antd';
import { useCallback, useEffect, useRef, useState } from "react";
import http from '../../service/http'

const Login: React.FC = () => {
  const [state, setState] = useState({ email:'', mobile: '' })
  const emailInputRef = useRef<InputRef>(null)
  const phoneInputRef = useRef<InputRef>(null)

  useEffect(()=>{
    console.log('hello');
    setTimeout(()=>{
      emailInputRef.current?.focus()
    }, 4)
  }, [state.email])

  const measuredRef = useCallback(node=>{
    //todo
  }, [])

  const onChange = (itemName) => {
    if (itemName === 'phone') {  
      setTimeout(()=>{
        phoneInputRef.current?.focus()
      }, 300)
    } else {
      setTimeout(()=>{
        emailInputRef.current?.focus()
      }, 300) 
    }
    
  }

  const goLogin = () => {
    const params = {
      startTime: '2022-09-17 00:00:00',
      endTime: '2022-09-17 23:59:59',
      projectCodeList: 'zsdc5566'
    }
    http.get('/data/overview/index/deal', { params }).then(data => {
      console.log(data);
    })
  }

  return (
    <div className="flex flex-row h-full" style={{ minHeight: '650px' }}>
      <section className="left flex-1 flex flex-col">
        <div className="flex items-center pl-5 h-20">
          <img src={cloud} />
          <span className="text-2xl font-medium ml-1">Windy</span>
        </div>
        <div className="flex-1 flex flex-row items-center">
          <div 
            style={{ height:'500px' }}
            className="p-8 my-0 mx-auto w-96 flex flex-col overflow-hidden shadow-md border border-solid border-gray-200 rounded-md">
            <div className="flex-none text-2xl font-medium">欢迎使用</div>
            <Tabs
              defaultActiveKey="1"
              animated={true}
              onChange={onChange}
            >
              <Tabs.TabPane tab="邮箱" key="email">
                <div className="">
                  <Input className="mt-4" size="large" placeholder="请输入你的邮箱" ref={emailInputRef} value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })}/>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="手机号" key="phone">
                <div className="">
                  <Input className="mt-4" size="large" placeholder="请输入你的手机号" ref={phoneInputRef} value={state.mobile} onChange={(e)=> {setState({ ...state, mobile: e.target.value })}}/>
                </div>
              </Tabs.TabPane>
            </Tabs>
            <div className="mt-4">
              <Button block type="primary" size="large" disabled={!state.email.length} onClick={()=>goLogin()}>下一步</Button>
            </div>
            <div className="mt-4">
              <Checkbox onChange={onChange}>
                <span className="text-gray-500">我已阅读并同意 </span>
                <a href="www.baidu.com">服务协议</a>
                <span className="text-gray-500"> 和 </span>
                <a href="www.baidu.com">隐私政策</a>
              </Checkbox>
            </div>
            <div className=" flex-grow"></div>
            <Divider plain>更多方式</Divider>
          </div>
        </div>
        <div className=""></div>
      </section>
      <section className="right flex-none flex flex-col justify-center items-center bg-blue-600" style={{ width: '420px' }}>
        <div className=" w-80 font-medium text-2xl text-left text-white">整合即时通讯、智能日历、云端创作等功能于一体，打造高效办公方式</div>
        <div className="right-img mt-10 h-60 w-80 bg-no-repeat" style={{ backgroundImage: `url(${imgUrl})` }}></div>
      </section>
    </div>
  )
}

export default Login