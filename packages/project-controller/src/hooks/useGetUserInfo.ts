import { useSelector } from 'react-redux'
import { stateType } from '../store'
import { IUserState } from "../store/modules/user.ts";

const useGetUserInfo = () => {
    const { username, nickname } = useSelector<stateType>((state) => state.user) as IUserState
    return { username, nickname }
}

export default useGetUserInfo
