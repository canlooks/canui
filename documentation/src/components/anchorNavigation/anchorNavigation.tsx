import {createContext, Dispatch, memo, ReactNode, SetStateAction, useContext, useMemo, useState} from 'react'
import {AnchorItem, AnchorList, Typography} from '@'

const AnchorContextProvider = createContext([[], () => {
}] as [
    AnchorItem[],
    Dispatch<SetStateAction<AnchorItem[]>>
])

export function useAnchorContext() {
    return useContext(AnchorContextProvider)
}

export function AnchorContext(props: {
    children?: ReactNode
}) {
    const [anchors, setAnchors] = useState<AnchorItem[]>([])

    return (
        <AnchorContextProvider value={
            useMemo(() => [anchors, setAnchors], [anchors])
        }>
            {props.children}
        </AnchorContextProvider>
    )
}

export const AnchorNavigation = memo(() => {
    const [anchors] = useAnchorContext()

    return !!anchors.length &&
        <>
            <Typography color="text.placeholder">
                本页导航
            </Typography>

            <AnchorList
                anchors={anchors}
                offset={72}
            />
        </>
})