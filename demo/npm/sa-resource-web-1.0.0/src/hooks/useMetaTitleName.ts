import { IS_PROD } from "@src/constant";
import {
    APP_CODE,
    APP_DEFAULT_NAME,
    ENTERPRISE_SETTING_NAME,
} from "@src/constant";
import { generateGroupType } from "@src/utils";

export const useMetaTitleName = () => {
    const { isEnterprise } = generateGroupType();

    const getProjectMetaTitle = () => {
        const projectInfo = window?.globalState?.projectInfo;
        const projectMenu = projectInfo?.menus?.projectMenu;
        // product名称
        const productName =
            projectMenu?.find(
                (item: { appCode: string }) => item.appCode === APP_CODE
            )?.name || APP_DEFAULT_NAME;
        // 空间名称
        const spaceName = projectInfo?.name;

        // 模块名称
        const moduleName = window?.globalState?.menuInfo?.name;
        let projectTitle = "";
        if (moduleName) {
            projectTitle += `-${moduleName}`;
        }
        if (productName) {
            projectTitle += `-${productName}`;
        }
        if (spaceName) {
            projectTitle += `-${spaceName}`;
        }
        return projectTitle;
    };

    const getEnterpriseMetaTitle = () => {
        const moduleName = window?.globalState?.menuInfo?.name;
        const companyConfigMenu =
            window?.globalState?.companyInfo?.menus?.companyConfigMenu || [];

        const settingGroupName = companyConfigMenu?.find(
            (item: { appCode: string }) => item.appCode === APP_CODE
        )?.name;

        let enterpriseTitle = "";
        if (moduleName) {
            enterpriseTitle += `-${moduleName}`;
        }
        if (settingGroupName) {
            enterpriseTitle += `-${settingGroupName}`;
        }
        // 为企业设置时 写死词条
        enterpriseTitle += `-${ENTERPRISE_SETTING_NAME}`;

        return enterpriseTitle
    };

    if (IS_PROD) {
        if (!isEnterprise) {
            return getProjectMetaTitle();
        }else{
            return getEnterpriseMetaTitle();
        }
    }
    return "";
};
