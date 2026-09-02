import { useMemo, useCallback,ReactNode,useRef, useEffect } from 'react';
import { Pagination as AntdPagination, Button } from 'antd';
import { customOption,inputPageConfirm,container} from './index.less';
import { PAGINATION_SIZE } from './constants';
import LeftIcon from './Icons/LeftIcon';
import RightIcon from './Icons/RightIcon';
import I18N from '@src/i18n'

type PaginationType =  {
  size?: PAGINATION_SIZE.DEFAULT | PAGINATION_SIZE.SMALL,
  simple?: boolean,
  showQuickJumper?: boolean
}

type PaginationItemType = 'page' | 'prev' | 'next'

const Pagination = ({
  size = PAGINATION_SIZE.DEFAULT,
  simple = false,
  showQuickJumper = true,
  ...rest
} : PaginationType) => {
  const paginationRef = useRef<HTMLDivElement>(null)
  const localeConfig = useMemo(() => {
    return {
      items_per_page: '',
      jump_to: I18N.Pagination.index.quDi,
    };
  }, []);

  useEffect(()=>{
    const node = paginationRef.current?.querySelector('.ant-select')
    if(node){
      node.setAttribute('select-before-content',I18N.Pagination.index.meiYeXianShi)
    }
  },[])

  // 自定义快速跳转的样式以及简单模式下隐藏快速跳转
  const customQuickJumper = useMemo(() => {
    if (showQuickJumper) {
      if (simple) {
        return true;
      }
      return {
        goButton: (
          <div className={customOption}>
            <Button
              className={inputPageConfirm}
              size={size === PAGINATION_SIZE.SMALL ? 'small' : 'middle'}
            >
              {I18N.FormikComp.index.queDing}
            </Button>
          </div>
        ),
      };
    }
    return false;
  }, [showQuickJumper, simple, size]);

  // TIP: 自定义节点时标签与类名最好与antd一致，否则无法应用antd的样式（PS: 样式也可自行修改）
  const handleCustomItem = useCallback((...rest: Array<PaginationItemType | ReactNode>) => {
    const [, type, originalElement] = rest;
    switch (type) {
      case 'prev':
        return (
          <button className="ant-pagination-item-link">
            <LeftIcon />
          </button>
        );
      case 'next':
        return (
          <button className="ant-pagination-item-link">
            <RightIcon />
          </button>
        );
      default:
        return originalElement;
    }
  }, []);
  // FIXME: 最右侧pageSize下拉框的图标无法调整成与设计一致，antd没有提供api供替换，影响不大
  return (
    <div className={container} ref={paginationRef}>
      <AntdPagination
        simple={simple}
        showQuickJumper={customQuickJumper}
        locale={localeConfig}
        itemRender={handleCustomItem}
        size={size}
        {...rest}
      />
    </div>
  );
};
export default Pagination;
