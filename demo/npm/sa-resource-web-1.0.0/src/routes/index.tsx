import React from 'react'
import ResourceContainer from '@src/pages/Resource/Home'

import AgentDetail from '@src/pages/AgentDetail'
import { PUBLIC_ROUTE } from '@src/constant'

export const routes = {
    HOME: {
        path: `${PUBLIC_ROUTE}/list`,
        element: <ResourceContainer/>
    },
    AGENT_DETAIL: {
        path: `${PUBLIC_ROUTE}/detail/:uuid`,
        element: <AgentDetail/>
    },
}


