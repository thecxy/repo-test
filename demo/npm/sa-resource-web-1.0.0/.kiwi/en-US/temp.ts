export default {
  agentGroups: {
    ceShiDiErCeng: "Test the second -level host group added",
    liuShuiXianPI: "Filial line PIPE",
    shouQuanSuoYouXiang: "Authorized project",
    qiYeJiZhuJi: "Enterprise console"
  },
  authorizeProjects: {
    zhuXiangMu: "Main project",
    beiFenXiangMu: "Backup project"
  },
  scripts: {
    eCHOMu: "echo \"target parameter key: $ {param_key}\" \n echo \"value: $ {param_value}\" \n\n OUT -K $ {Param_key} -val $ {param_value}",
    canShuDeZhiKe: "The value of the parameter, you can use $ {}",
    canShuZhiKeYin: "Parameter value, $ {} reference upstream parameters",
    canShuDeKE: "The key of the parameter",
    keChuangJianXiaYou: "Create downstream parameters, which can change the conflict parameters to other keys to carry",
    shengChengCanShuRong: "Generate parameters-container running",
    dATED: "date=`date +%s`\nmkdir -p /chart\ncd /chart\ncurl -o chart.zip ${IPIPE_CHART_ZIP}\nunzip chart.zip -d chart\ncd chart\nls\ncd ${ChartDir}\nresult=`/helm/3.4.0/helm package ./ |grep \"tgz\" | awk -F'[:] ' '{print $2}'`\nif [ ! -n $result ]; then  \n  echo \"打包失败\"\n  exit 1 \nfi \n\ncurl -u admin:password -X PUT \"http://192.168.81.17:31090/artifactory/DEV/${date}${result}\" -T ${result}\n\necho \"================================\"\necho \"chart remote web URL ：http://192.168.81.17:31090/artifactory/DEV/${date}${result}\"\necho \"================================\"\n\nout -k IPIPE_CHART_PATH -val \"http://192.168.81.17:31090/artifactory/DEV/${date}${result}\"",
    cHART: "Chart published to nexus",
    sETES: "set -e\nstr=``\nif [ -n \"${PROXIMA_APP_IMAGE}\" ]; then str=\"${str} -a ${PROXIMA_APP_IMAGE}\"; fi\nif [ -n \"${PROXIMA_CORE_IMAGE}\" ]; then str=\"${str} -c ${PROXIMA_CORE_IMAGE}\"; fi\nif [ -n \"${PROXIMA_VM_IMAGE}\" ]; then str=\"${str} -v ${PROXIMA_VM_IMAGE}\"; fi\nif [ -n \"${PROXIMA_CAMUNDA_IMAGE}\" ]; then str=\"${str} -b ${PROXIMA_CAMUNDA_IMAGE}\"; fi\n\necho ${str}\n\nif [[ $(expr match \"$DOCKER_TAG\" 'test') != 0 ]]; then\n  echo \"部署功能测试环境\"\n  sshpass -p 'OSCcc@2021' ssh root@192.168.81.61 \"cd /home/proxima-compose && sh ./ci.sh $str\"\n  exec_result=$?\n  if [[ \"$exec_result\" = \"0\" ]]; then\n    echo \"Success\"\n    exit 0\n  else\n    echo \"failure\"\n    exit 1\n  fi\nelif [[ $(expr match \"$DOCKER_TAG\" 'dev') != 0 ]]; then\n  echo \"部署开发联调环境\"\n  sshpass -p 'OSCcc@2022' ssh root@192.168.80.87 \"cd /root/proxima-compose && sh ./ci.sh $str\"\n  exec_result=$?\n  if [[ \"$exec_result\" = \"0\" ]]; then\n    echo \"Success\"\n    exit 0\n  else\n    echo \"failure\"\n    exit 1\n  fi\nelif [[ $(expr match \"$DOCKER_TAG\" 'feature') != 0 ]]; then\n  echo \"部署分支测试环境\"\n  sshpass -p 'OSCcc@2021' ssh root@192.168.80.100 'cd /root/proxima-compose && sh ./ci.sh $str'\n  exec_result=$?\n  if [[ \"$exec_result\" = \"0\" ]]; then\n    echo \"Success\"\n    exit 0\n  else\n    echo \"failure\"\n    exit 1\n  fi\nelse\n  echo \"跳过部署\"\nfi",
    pROXI: "proxima-environment deployment",
    daBaoLuJing: "Packing path",
    zhiPinMingCheng: "Product name",
    zhiPinLuJing: "Product path",
    keLongMingLing: "Clone command",
    gITYiLai: "Git dependency packaging",
    xuYaoZuoLuJing: "# Need to do path safety monitoring to avoid deleting key core files of the operating system \n # Logic: \n # 1. User input application name, version, publishing address, port, environment and other information \n # 2. Support the user setting whether to stop and clear the existing application, or stop and directly cover the existing application \n # 3. Skill support and inspection of the application start and stop script support \n\n RM -RF/ROOT/LHC/APPS/$ {app_pub_path} \n MKDIR -P/ROOT/LHC/APPS/$ {app_pub_path} \n\n CD/ROOT/LHC/APPS/$ {app} \n Wget \"$ {agile_product_path}\" \n\n tar -xvf *.tar \n cd target \n\n mv *.jar $ {app} .jar \n\n java -jar $ {app} .jar -server.port = $ {app_port} &",
    buShuDuanKou: "Deployment port",
    buShuWenJianLu: "Deployment file path",
    feiGongYong: "Non -sharing",
    jAVAYing: "Java",
    zhiPinMingCi: "Product noun",
    sETEP: "set -E\npwd =` pwd`\ndate = `date +%s`\njmeterzip = \"jmeter.zip\"\nResult = \"$ {PWD}/Resultjmt\"\nresult_jtl = \"$ {result}/result $ {date} .jtl\"\nresult_log = \"$ {result}/result $ {date} .log\"\njtl_url = \"\" \"\nlog_url = \"\" \"\nmkdir -P $ {result}\n\necho \"---------- JMETER script download: ipipe_jmeter_zip -----------------------------------\nCurl -o $ jmeterzip http://osc.gitee.work:9000/job-center/staging-srea/2022-03/1646128985/artifipe_ipter_zip.zip\nunzip -o jmeter.zip> /dev /null 2> & 1\nLS\necho \"------------- JMETER script download is complete --------\"\necho \"jmx file path: $ {jmeterjmxpath}\"\nEcho \"Platform domain name or IP port: $ {domainhost}\"\necho \"Other parameters: $ {OthercmdParaMtr}\"\necho \"--------- JMETER version ----------\" \"\" \"\"\njmeter -v\necho \"--------- start to run --------\" \"\" \"\"\nEcho \"JMETER -N -T $ {PWD}/$ {jmeterjmxpath} -l $ {result_jtl} -j $ {result_log} -jhost = $ {domainhost} $ {OthercmdparaMtr}\" \"\" \"\njmeter -n -t $ {jmeterjmxpath} -l $ {result_jtl} -j $ {result_log} -jhost = $ {domainhost} $ {OtherCMDPARAMTR}\n\necho \"---------- start to upload jtl \\ log -------------------\nif [-f \"$ {result_jtl}\"]; then\nCurl -u admin: password -X put \"http://192.168.817:31090/artifactory/dev/result $ {date }.jtl\" -t $ {result_jtl}\njtl_url = \"http://192.168.817:31090/artifactory/dev/result $ {Date }.jtl\" \"\nFI\n\nif [-f \"$ {result_log}\"]; then\nCurl -u admin: password -X put \"http://192.168.817:31090/artifactory/dev/result $ {Date }.log\" -t $ {result_log}\nlog_url = \"http://192.168.817:31090/artifactory/dev/result $ {Date }.log\"\nFI\n\necho \"******************* results *******************\"\necho \"jtl: $ {jtl_url}\"\necho \"log: $ {log_url}\"\necho \"************************************\n\necho \"-----------------\" \"\" \"",
    qiTaMingLingCan: "Other command parameters",
    pingTaiYuMingHuo: "Platform domain name or IP port",
    jMXWenJian: "JMX file path",
    jMETE: "Jmeter pressure test",
    eCHOC: "echo $ {core_docker_image_url}> Images.txt\necho $ {app_docker_image_url} >> images.txt\necho $ {camunda_docker_image_url} >> images.txt\necho $ {vm_docker_image_url} >> images.txt\n\necho \"Version Number: $ {Realse_Version}\"\necho $ {realse_version}> Version\n\nfilename = $ (date +'%y-%m-%d_%h%m%s'). Zip\necho file name: $ FILENAME\necho $ filename> FILENAME\n\n## Copy version\nsshpass -P 'OSCCC@2022' SSH ROOT@192.1680.87 \"RM -RF /Data /Version\"\nsshpass -P 'OSCCC@2022' SCP ./version Root@192.168.80.87:/Data\n\n## Copy FileName\nsshpass -P 'OSCCC@2022' SSH ROOT@192.1680.87 \"RM -RF /DATA /FILENAME\"\nsshpass -P 'OSCCC@2022' SCP ./filename Root@192.168.80.87:/Data\n\n## Copy Images.txt\nsshpass -P 'OSCCC@2022' SSH ROOT@192.1680.87 \"RM -RF /Data/images.txt\"\nsshpass -P 'OSCCC@2022' SCP ./images.txt Root@192.168.80.87:/Data\n\n\n## Clear historical files\nsshpass -P 'OSCCC@2022' SSH ROOT@192.1680.87 \"RM -RF /Data/*.tgz\"\nsshpass -P 'OSCCC@2022' SSH ROOT@192.1680.87 \"RM -RF /Data/*.zip\"\n\n## implement\nsshpass -P 'OSCCC@2022' SSH ROOT@192.1680.87 \"CD /Data; Sh Package.sh\"\n\nEcho \"Download the upgrade package, please execute commands: Curl -u admin: password -O http://192.168.817:31090/artifactory/proxima/ $filename\" \"\" \"\" \"\" \"\" \"\" \"\" \"\" \"",
    pROXI2: "Proxima-packaging machine"
  },
  users: {
    zhaoYunXiao: "Zhao Yunzheng",
    chaXunChengGong: "search successful",
    qiYeChengYuan: "Corporate",
    zhangChao: "Zhang Chao",
    qiYeGuanLiYuan: "Corporate administrator"
  }
}

