import { useState, useEffect } from "react"
import useGetUserInfo from "./useGetUserInfo.ts"
import {  useRequest } from 'ahooks'
import { getUserInfo } from '../api/modules/user.ts'
import { useDispatch } from "react-redux";
import {loginReducer} from "../store/modules/user.ts";

const useLoadUserData = () => {
    const [waitingUserData, setWaitingUserData] = useState(true)
    const dispatch = useDispatch()

    const { run } = useRequest(getUserInfo, {
        manual: true,
        onSuccess: (data) => {
            const { username, nickname } = data
            dispatch(loginReducer({username, nickname}))
        },
        onError: () => {
            setWaitingUserData(false)
        }
    })

    const { username } = useGetUserInfo()

    useEffect(() => {
        if(username) {
            setWaitingUserData(false)
            return
        }
        run()
    }, [username])

    return { waitingUserData }
}

export default useLoadUserData