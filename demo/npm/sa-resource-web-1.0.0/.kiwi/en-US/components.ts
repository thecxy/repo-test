export default {
    TimeSelector: {
        jinTian: 'Nearly 7 days',
        jinXiaoShi: 'Nearly 24 hours',
        shiShi: 'real time'
    },
    AddGroupModal: {
        suoYouZhuJi: 'All hosts',
        queDingYaoShanChu: 'Are you sure to delete the host group: {val1}?',
        shanChuQueRen: 'Delete confirmation',
        qingXuanZeShouQuan: 'Please select the authorization project',
        qingXuanZeSSuoShu: 'Please select the project to which you belong', 
        qingShuRuFenZu: 'Please enter a group description',
        fenZuMiaoShu: 'Packet description',
        qingShuRuFenZu2: 'Please enter the group name',
        fenZuMing: 'Group name',
        weiYiBiaoZhi: 'Uniquely identifies',
        shangJiFenZu: 'Superior group',
        aGENT: '{val1} grouping'
    },
    AgentGroupTree: {
        xiang: 'P',
        xiangMuJi: 'Project level',
        qi: 'E',
        qiYeJi: 'Enterprise',
        zhuJiFenZuBu: 'The host group cannot exceed 5 levels',
        lABEL: '{val1} grouping',
        dangQianJinZhiChi: 'Currently only supports dragging at the same level'
    },
    DeleteAgentModal: {
        beiShanChuZhuJi: 'The historical data of the deleted host cannot be restored, confirm the operation?',
        beiShanChuZhuJi2: 'The tasks that are deleted and newly received will fail and the historical data cannot be restored. Confirmation operations?'
    },
    ExecuteScript: {
        muBiaoFuWuQi: 'Target server',
        qingShuRuChaoShi: 'Please enter the timeout time',
        chaoShiShiChangMiao: 'Timeout time (second)',
        qingShuRuJiaoBen: 'Please enter the script content',
        jiaoBenNeiRong: 'Script content',
        xuanZeJiaoBen: 'Choice script',
        jiaoBenMingCheng: 'Script name',
        qingXuanZeJiaoBen: 'Please select the script',
        qingXuanZeJiaoBen2: 'Please select the script source',
        jiaoBenLaiYuan: 'Script source',
        buZhouMingCheng: 'Step name',
        zhiXing: 'implement',
        zhiXingXiangQing: 'Implementation details',
    },
    ExecutiveLog: {
        zanWuRiZhi: 'No logs',
        zhiXingJieGuo: 'Results of the'
    },
    FileDistribution: {
        fenFa: 'distribution',
        buZhouMingChengXian: 'Step name is limited to 60 characters',
        qingShuRuBuZhou: 'Please enter the step name',
        qingWuTianXieYi: 'Do not fill in the same path on a host',
        dangQianYouBenDi: 'There are currently local documents that are not uploaded, please wait for the upload to be preserved',
        qingZhiShaoXuanZe: 'Please select at least one source file',
        qingTianXieFenFa: 'Please fill in the distribution path',
        muBiaoLuJing: 'Target path',
        chuanShuMuBiao: 'Transmission target',
        qingXuanZeFuWu: 'please choose the server',
        qingShuRuWenJian: 'Please enter the file path',
        qingXuanZeWenJian: 'Please select the file source',
        wenJianLaiYuan: 'File source',
        qiYongXiaZaiXian: 'Enable download speed limit',
        qiYongShangChuanXian: 'Enable and upload speed',
        chaoShiShiChangMiao: 'Timeout time (second)',
        chuanShuMoShi: 'Transmission mode',
        yanJinPanDuanMu: 'Rigid judging whether the target path exists, if there is no existence, it will terminate the task directly.',
        yanJinMoShiZhi: 'Strict mode refers to:',
        buLunMuBiaoLu: 'Regardless of whether the target path exists, it will be transmitted according to the target path filled by the user (the path will not be created automatically).',
        qiangZhiMoShiZhi: 'Compulsory mode refers to:'
    },
    LogItem: {
        fuZhiShiBai: 'Copy failure!',
        wuXiaoFuZhiNei: 'Effective copy (the content is empty)!',
        fuZhiChengGong: 'Copy successfully!'
    },
    ShutDownOrRebootAgentModal: {
        shouQi: 'Put away',
        ninYiXuanZe: 'You have selected ',
        houZhiLingJiangWu: 'The instruction will not be stopped',
        queDingAnNiu: 'Confirm button',
        miaoHouFaSongDian: 'Send later, click',
        zhiLingJiangZai: 'The instruction will be ',
        shiDuanNeiZhengZai: 'The tasks that are running and newly received within the time period will fail.',
        suoXuanZhuJi: 'Selected host',
        aGENT: '{val1} host',
        quXiaoCaoZuo: 'Cancel operation',
        queDingCaoZuo: 'Determine the operation'
    },
    ShutdownOrRebootConfig: {
        kuanShuShiJianZui: 'The minimum value of forgive time is {val1}',
        qingSheZhiKuanShu: 'Please set up forgiveness time',
        kuanShuShiJian: 'Forgive time',
        kuanShuShiJianTip: 'The tolerance time is the host delayed shutdown/restart time, if set to 60 seconds, then the shutdown/restart operation will be performed after 60 seconds. The tolerance time is the host delayed shutdown/restart time, if set to 60 seconds, the Close/restart operation is performed after 60 seconds',
    },
    TargetServer: {
        qingXuanZeLI: 'Please select Linux type server',
        qingXuanZeWin: 'Please choose Linux type server',
        wINDO: 'Windows cannot run Linux Bash',
        linuxINDO: 'Linux cannot run Linux Bat\n',
    },
    UpdateAgent: {
        aGENT: 'Agent version upgrade'
    }
}

