import Vue from 'vue';
import Router from 'vue-router';
import VueClipboard from 'vue-clipboard2';
import main from '../components/main';
import goodsList from '../components/goodsManage/goodsList/goodsList';
import goodsEdit from '../components/goodsManage/goodsList/goodsEdit';
import goodsClassify from '../components/goodsManage/goodsClassify/goodClassify';
import imgSpace from '../components/goodsManage/imgSpace/imgSpace';
import imgSpaceList from '../components/goodsManage/imgSpace/imgSpaceList';
import mallIndex from '../components/storeManage/mallIndex/mallIndex';
import mallPage from '../components/storeManage/mallPage/mallPage';
import newPage from '../components/storeManage/newPage/newPage';

// import page403 from '../error/403.vue'
// import page404 from '../error/404.vue'
// import page500 from '../error/500.vue'
import commonSet from '../components/mallSet/commonSet/commonSet';
import orderSet from '../components/mallSet/orderSet/orderSet';
import templateEdit from '../components/mallSet/orderSet/templateEdit';
import searchSet from '../components/mallSet/searchSet/searchSet';
import orderAll from '../components/orderManage/orderAll/orderAll';
import orderDetails from '../components/orderManage/orderAll/orderDetails';
import batchDelivery from '../components/orderManage/orderAll/batchDelivery';
import refundManage from '../components/orderManage/refundManage/refundManage';
import refundOrderDetails from '../components/orderManage/refundManage/refundOrderDetails';
import evaluationManage from '../components/orderManage/evaluationManage/evaluationManage';
import batchManage from '../components/orderManage/batchManage/batchManage';
import goodsSynList from '../components/goodsManage/goodsList/goodsSynList';
import goodsErpEdit from '../components/goodsManage/goodsList/goodsErpEdit';
import discountSale from '../components/promotionManage/discountSale/discountSale';
import packageMail from '../components/promotionManage/packageMail/packageMail';
import mailActivityGoods from '../components/promotionManage/packageMail/mailActivityGoods';
import createActivity from '../components/promotionManage/discountSale/createActivity';
import createActivityGoods from '../components/promotionManage/discountSale/goodsList';

import evaluateList from '../components/orderManage/evaluate/evaluateList.vue';
import addressList from '../components/mallSet/addressSet/addressList.vue';
import addressEdit from '../components/mallSet/addressSet/addressEdit.vue';
import imgRecycle from '../components/goodsManage/imgRecycle/imgRecycle';
import imgRecycleList from '../components/goodsManage/imgRecycle/imgRecycleList';
import dataAccuracy from '../components/mallSet/dataAccuracy/dataAccuracy';

import reduceDiscountList from '../components/promotionManage/reduceSend/activityList';
import newReduceDiscount from '../components/promotionManage/reduceSend/newActivity';
import selectGoods from '../components/promotionManage/reduceSend/pieceGoods';

import matchList from '../components/goodsManage/goodsMatch/matchList';

import reportList from '../components/reportCenter/reportList/reportList';
import uploadList from '../components/reportCenter/uploadRecord/uploadList';

Vue.use(Router);
Vue.use(VueClipboard);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      children: [
        {
          path: 'goodsClassify',
          name: 'goodsClassify',
          component: goodsClassify
        },
        {
          path: 'goodsList',
          name: 'goodsList',
          component: goodsList
        },
        {
          path: 'goodsEdit/:mallProId/:createSource',
          name: 'goodsEdit',
          component: goodsEdit
        },

        {
          path: 'mallIndex',
          name: 'mallIndex',
          component: mallIndex
        },
        {
          path: 'mallPage',
          name: 'mallPage',
          component: mallPage
        },
        {
          path: 'commonSet',
          name: 'commonSet',
          component: commonSet
        },
        {
          path: 'orderSet',
          name: 'orderSet',
          component: orderSet
        },
        {
          path: 'templateEdit/:templateId',
          name: 'templateEdit',
          component: templateEdit
        },
        {
          path: 'searchSet',
          name: 'searchSet',
          component: searchSet
        },
        {
          path: 'dataAccuracy',
          name: 'dataAccuracy',
          component: dataAccuracy
        },
        {
          path: 'orderAll',
          name: 'orderAll',
          component: orderAll
        },
        {
          path: 'refundManage',
          name: 'refundManage',
          component: refundManage
        },
        {
          path: 'evaluationManage',
          name: 'evaluationManage',
          component: evaluationManage
        },
        {
          path: 'batchManage',
          name: 'batchManage',
          component: batchManage
        },
        {
          path: 'orderDetails/:orderId',
          name: 'orderDetails',
          component: orderDetails
        },
        {
          path: 'refundOrderDetails/:orderRefundId',
          name: 'refundOrderDetails',
          component: refundOrderDetails
        },
        {
          path: 'batchDelivery',
          name: 'batchDelivery',
          component: batchDelivery
        },
        {
          path: 'goodsSynList',
          name: 'goodsSynList',
          component: goodsSynList
        },
        {
          path: 'goodsErpEdit/:mallProId',
          name: 'goodsErpEdit',
          component: goodsErpEdit
        },
        {
          path: 'discountSale',
          name: 'discountSale',
          component: discountSale
        },
        {
          path: 'packageMail',
          name: 'packageMail',
          component: packageMail
        },
        {
          path: 'mailActivityGoods',
          name: 'mailActivityGoods',
          component: mailActivityGoods
        },
        {
          path: 'createActivity',
          name: 'createActivity',
          component: createActivity
        },
        {
          path: 'createActivityGoods',
          name: 'createActivityGoods',
          component: createActivityGoods
        },
        {
          path: 'evaluateList',
          name: 'evaluateList',
          component: evaluateList
        },
        {
          path: 'addressList',
          name: 'addressList',
          component: addressList
        },
        {
          path: 'addressEdit/:sellerAddressId',
          name: 'addressEdit',
          component: addressEdit
        },
        {
          path: 'reduceDiscountList',
          name: 'reduceDiscountList',
          component: reduceDiscountList
        },
        {
          path: 'newReduceDiscount/:activityId',
          name: 'newReduceDiscount',
          component: newReduceDiscount
        },
        {
          path: 'selectGoods/:activityId/:selectNum',
          name: 'selectGoods',
          component: selectGoods
        },
        {
          path: 'matchList',
          name: 'matchList',
          component: matchList
        },
        {
          path: '/reportList',
          name: 'reportList',
          component: reportList
        },
        {
          path: '/uploadList',
          name: 'uploadList',
          component: uploadList
        }
      ]
    },
    {
      path: '/newPage/:pageId',
      name: 'newPage',
      component: newPage
    },
    {
      path: '/imgSpace',
      name: 'imgSpace',
      component: imgSpace,
      children: [
        {
          path: '/imgSpaceList',
          name: 'imgSpaceList',
          component: imgSpaceList
        }
      ]
    },
    {
      path: '/imgRecycle',
      name: 'imgRecycle',
      component: imgRecycle,
      children: [
        {
          path: '/imgRecycleList',
          name: 'imgRecycleList',
          component: imgRecycleList
        }
      ]
    }
  ]
});

export default router;
