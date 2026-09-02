// connectType	        连接方式 0：密码连接 1：密钥连接	        query	false   integer(int32)
// ip	                主机ip	                            query	false   string
// name	                主机名称	                            query	false   string
// notAllowedCommand	禁用命令	                            query	false   string
// password	            主机登录密码	                        query	false   string
// port	                连接端口	                            query	false   integer(int32)
// privateKeyPath	    主机登录密钥	                        query	false   string
// user	                主机登录用户	                        query	false   string
// uuid	                主机uuid	                        query	false                   // string
export enum CONNECT_TYPE {
    PASSWORD,
    SECRET_KEY
}

export type AgentFormInfo = {
    connectType: CONNECT_TYPE,
    ip: string
    name: string
    // 前端暂时不做处理 from FanBingYang
    notAllowedCommand?: string
    port: string
    user: string
    uuid: string
    privateKeyPath?: {
        fileName: string
        fileNameFromServer: string
    }
    password?: string
}

export enum ERROR_TYPE {
    ERROR_CONNECTION_INFORMATION = 'ERROR_CONNECTION_INFORMATION',
    INFORMATION_DOES_NOT_EXIST = 'INFORMATION_DOES_NOT_EXIST'
}
