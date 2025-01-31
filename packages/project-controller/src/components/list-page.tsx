import React, {useEffect} from 'react'
import { useState } from "react"
import {Pagination} from "antd"
import {useLocation, useNavigate, useSearchParams} from "react-router-dom"

interface Props {
    total: number
}

const ListPage: React.FC<Props> = (props) => {
    const { total } = props
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [searchParams] = useSearchParams()

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '1')
        const size = parseInt(searchParams.get('pageSize') || '10')
        setCurrent(page)
        setPageSize(size)
    }, [searchParams])

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const pageChange = (page: number, pageSize: number) => {
        setCurrent(page)
        setPageSize(pageSize)
        searchParams.set('page', page.toString())
        searchParams.set('pageSize', pageSize.toString())

        navigate({
            pathname: pathname,
            search: searchParams.toString()
        })
    }

    return (
        <Pagination total={total} current={current} pageSize={pageSize} onChange={pageChange} />
    )
}

export default ListPage