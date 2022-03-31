# -*- coding: utf-8 -*-

"""
@author: zzj

@contact: QQ:10996784

@Created on: 2020/10/13 007 11:28
"""

from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect

from FundProjects.models import fundBasicInfo, fundPnlInfo, tradeInfo, deruiLimitData, deruisectordata, dailyFinanceData, confirmNetValueInfo
from django.db.models import Sum
from datetime import datetime
import pandas as pd

import FundProjects.method.fundpnlConfirm as fundpnlConfirm
import FundProjects.method.deruiSector as deruiSector
import FundProjects.method.investAmount as investAmount

hisSpecialProductList = ['钢铁1号', '星光璀璨1号', '和誉3号', '银河期货大宗商品1号', '权银河旗舰3/4号', '银河人保安心盛世1号', '融宝16号', '华澳臻智稳健1期',
                         '权银河恒星1号']
nonInvestProductList = ['权银河旗舰3/4号', '银河人保安心盛世1号', '融宝16号', '华澳臻智稳健1期', '权银河恒星1号']


# ===========================================    页面     ===========================================================
# 主页
def login(request):
    return render(request, 'login.html')
def index(request):
    return render(request, 'index.html')


# 基金录入界面：交易、产品、额度、单位净值、计算日报盈亏
def tradeinfo(request):
    return render(request, 'add//tradeinfo.html')


def newproduct(request):
    return render(request, 'add//newproduct.html')


def modifyamt(request):
    return render(request, 'add//modifyamt.html')


def unitdata(request):
    return render(request, 'add//unitdata.html')


def calcpnlreport(request):
    return render(request, 'add//calcpnlreport.html')


def calctruepnl(request):
    return render(request, 'add//calctruepnl.html')

# 合并报表
def combinedStat(request):
    return render(request, 'report//combinedStat.html')

# 证券报告
def productReportSec(request):
    return render(request, 'report//productReportSec.html')


# 基金收益率数据 及 其他查询数据
def fundData(request):
    return render(request, 'report//fundData.html')


# 经纪业务数据
def productReportBroke(request):
    return render(request, 'report//productReportBroke.html')

# 经纪业务数据
def lossReport(request):
    return render(request, 'report//lossReport.html')

# 日报
def dailyReport(request):
    return render(request, 'periodicReport//dailyReport.html')


def doubleWeeklyReport(request):
    return render(request, 'periodicReport//doubleWeeklyReport.html')

def monthlyReport(request):
    return render(request, 'periodicReport//monthlyReport.html')

def productMonthlyReport(request):
    return render(request, 'periodicReport//productMonthlyReport.html')
# 数据分析
def deruiSectorAnalysis(request):
    return render(request, 'dataAnalysis//deruiSectorAnalysis.html')

def companyAnalysis(request):
    return render(request, 'dataAnalysis//companyAnalysis.html')

# CHECK！真实日期盈亏数据
def test1(request):
    return render(request, 'test//test1.html')


# TEST！数据回填，修改录入
def test2(request):
    return render(request, 'test//test2.html')


def test3(request):
    return render(request, 'test//test3.html')


# ===============================================   界面数据录入   =======================================================
# 真实盈亏数据计算，使用fundpnlConfirm方法
def getData(request):
    today = datetime.today()  # 获取当前日期
    params = request.GET
    date = params.get("date")  # 前端传入的时间
    ''':param
        1.判断前端是否传入时间
        2.如果没有传入时间,则使用今天
        3.传入时间,就根据传入时间查询
    '''
    if date is None or date == "":
        year = str(today.year) + '-01-01'
        month = str(today.year) + '-' + str(today.month) + '-01'
        project_date = today.strftime("%Y-%m-%d")
        queryset = fundBasicInfo.objects.values()
    else:
        year = str(datetime.strptime(date, "%Y-%m-%d").year) + '-01-01'
        month = str(datetime.strptime(date, "%Y-%m-%d").year) + '-' + str(
            datetime.strptime(date, "%Y-%m-%d").month) + '-01'
        project_date = datetime.strptime(date, "%Y-%m-%d").strftime("%Y-%m-%d")
        queryset = fundBasicInfo.objects.filter(confirmDate2__lte=date).values()
    ''':param
        1.根据上面查询出的产品名,查询产品名称的盈亏数据

    '''
    mydata = []
    results = {
        "total": 0,
        "data": [],
        "projectList": []

    }
    projectList = []

    for query in queryset:
        dicts = {
            "date": project_date,
            "productName": "",
            "status": "",
            "pnlSum_total": 0,
            "pnlSum_year": 0,
            "pnlSum_month": 0,
        }
        productName = query.get('productName')
        sector = query.get('sector')
        dicts['investPurpose'] = query.get('investPurpose')
        status = query.get('status')
        dicts['productName'] = productName
        dicts['status'] = status

        begDate_total, endDate_total, pnlSum_total = fundpnlConfirm.durPnl(productName, '', project_date)
        begDate_year, endDate_year, pnlSum_year = fundpnlConfirm.durPnl(productName, year, project_date)
        begDate_month, endDate_month, pnlSum_month = fundpnlConfirm.durPnl(productName, month, project_date)
        begDate_day, endDate_day, pnlSum_day = fundpnlConfirm.durPnl(productName, project_date, project_date)

        dicts['pnlSum_total'] = round(pnlSum_total, 2)
        dicts['pnlSum_year'] = round(pnlSum_year, 2)
        dicts['pnlSum_month'] = round(pnlSum_month, 2)
        dicts['pnlSum_day'] = round(pnlSum_day, 2)
        dicts['begDate_day'] = begDate_day
        dicts['endDate_day'] = endDate_day
        day = (datetime.strptime(endDate_day, "%Y-%m-%d") - datetime.strptime(begDate_day, "%Y-%m-%d")).days
        if day == 0:
            dicts['demo'] = '当日无数据'
        else:
            dicts['demo'] = '当日盈亏为' + str(day) + '天数据'
        # 将数据添加到返回给前端的列表中
        projectList.append(dicts)

    pageIndex = request.GET.get('page', 1)
    pageSize = request.GET.get('limit', 10)
    pageInator = Paginator(mydata, pageSize)
    contacts = pageInator.page(pageIndex)
    results['data'] = contacts.object_list
    results['total'] = len(projectList)
    results['projectList'] = projectList
    # print(results)
    return JsonResponse({
        "code": 0,
        "msg": "成功",
        "data": results,
        "total": 0
    })


# ===============================================   计算报告数据   =======================================================
# 计算年化收益率
def getRet(request):
    today = datetime.today()  # 获取当前日期
    params = request.GET
    dateRange = params.get("date")
    sectorCheck = params.get("sector", "全部")
    investPurposeCheck = params.get("investPurpose", "全部")
    strategyCheck = params.get("strategy", "全部")
    print(investPurposeCheck)
    if dateRange == '' or dateRange is None:
        begDate = str(today.year) + "-01-01"
        endDate = today.strftime("%Y-%m-%d")
    else:
        begDate = dateRange[:10]  # 前端传入的时间
        endDate = dateRange[-10:]

    results = {
        "total": 0,
        "data": [],
        "fundRetInfo": []

    }
    queryset = fundBasicInfo.objects.filter(confirmDate2__lte=endDate).values()
    fundRetInfo = []
    pnlDict = {'date': [], 'productName': [], 'cost': [], 'pnl': []}
    for query in queryset:
        dicts = {
            "begDate": begDate,
            "endDate": endDate,
            "status": '',
            "productType1": '',
            "strategy": '',
            "productName": '',
            "yearRet": 0
        }
        productName = query.get('productName')
        sector = query.get('sector')
        investPurpose = query.get('investPurpose')
        strategy = query.get('strategy')
        if sectorCheck != '全部':
            if sector != sectorCheck:
                continue
        if investPurposeCheck != '全部':
            if investPurpose != investPurposeCheck:
                continue
        if strategyCheck != '全部':
            if strategy != strategyCheck:
                continue
        pnlList = fundPnlInfo.objects.filter(productName=productName, date__gte=begDate, date__lte=endDate).order_by(
            "date").values()
        i = 0
        retList = 1
        totalPnl = 0
        if len(pnlList) != 0:
            for pnl in pnlList:
                if pnl.get('acBuyAmount') == 0:
                    continue
                if i == 0:
                    # 使用第一日成本
                    # 读取今日是否有赎回，如果有，扣除今日赎回
                    tradeData = tradeInfo.objects.filter(productName=productName, tradeType='赎回',
                                                         confirmDate=begDate).first()
                    if tradeData is None:
                        cost = pnl.get('buyCashAmount') - pnl.get('sellCost')
                    else:
                        cost = pnl.get('buyCashAmount') - pnl.get('sellCost') + tradeData.cost
                    pnlDict['cost'].append(cost)
                    if cost == 0:
                        ret = pnl.get('todayPnl') / pnl.get('buyCashAmount')
                    else:
                        ret = pnl.get('todayPnl') / cost
                    i = i + 1
                    beg = pnl.get('date')
                    end = pnl.get('date')
                    initCost = pnl.get('buyCashAmount')
                    totalPnl = totalPnl + pnl.get('todayPnl')
                    redeem = pnl.get('sellCost')

                    # 计算后，更新成本
                    cost = (pnl.get('acBuyAmount') - pnl.get('acSellAmount')) * pnl.get('todayNetValue') - pnl.get(
                        'buyCashAmount')
                else:
                    # 使用上一日成本
                    cost = cost + pnl.get('buyCashAmount')
                    pnlDict['cost'].append(cost)
                    ret = pnl.get('todayPnl') / cost
                    # 计算收益后，更新今日成本
                    cost = (pnl.get('acBuyAmount') - pnl.get('acSellAmount')) * pnl.get('todayNetValue') - pnl.get(
                        'buyCashAmount')
                    i = i + 1
                    end = pnl.get('date')
                    initCost = pnl.get('buyCashAmount')
                    totalPnl = totalPnl + pnl.get('todayPnl')
                    redeem = pnl.get('sellCost')

                # 计算总额
                pnlDict['date'].append(end)
                pnlDict['productName'].append(productName)
                pnlDict['pnl'].append(pnl.get('todayPnl'))
                # 计算总额
                retList = retList * (1 + ret)
                if (pnl.get('acBuyAmount') - pnl.get('acSellAmount')) == 0:
                    break
            days = (end - beg).days + 1
            yearRet = round((retList ** (1 / days) - 1) * 365. * 100, 4)

            dicts['beginDate'] = beg.strftime("%Y-%m-%d")
            dicts['endDate'] = end.strftime("%Y-%m-%d")
            dicts['productName'] = productName
            dicts['sector'] = sector
            dicts['investPurpose'] = investPurpose
            dicts['status'] = query.get('status')
            dicts['productType1'] = query.get('productType1')
            dicts['strategy'] = query.get('strategy')
            dicts['initCost'] = initCost
            dicts['redeem'] = redeem
            dicts['totalPnl'] = round(totalPnl, 2)
            dicts['ret'] = yearRet

            # 将数据添加到返回给前端的列表中
            fundRetInfo.append(dicts)

    totalDict = {}
    begDate = datetime.strptime(begDate, '%Y-%m-%d')
    endDate = datetime.strptime(endDate, '%Y-%m-%d')
    if len(pnlDict) == 0:
        totalDict['beginDate'] = begDate
        totalDict['endDate'] = endDate
        totalDict['totalYearRet'] = 0.
    else:
        df = pd.DataFrame(pnlDict)
        retList = 1
        for d in list(set(df.date.tolist())):
            todayDf = df.loc[df.date == d]
            ret = todayDf.pnl.sum() / todayDf.cost.sum()
            retList = retList * (1 + ret)

    days = (endDate - begDate).days + 1
    totalYearRet = round((retList ** (1 / days) - 1) * 365. * 100, 4)

    totalDict['beginDate'] = begDate
    totalDict['endDate'] = endDate
    totalDict['sector'] = sectorCheck
    totalDict['totalYearRet'] = totalYearRet
    totalDict['strategy'] = strategyCheck
    totalDict['investPurpose'] = investPurposeCheck
    totalData = []
    totalData.append(totalDict)
    pageIndex = request.GET.get('page', 1)
    pageSize = request.GET.get('limit', 10)
    pageInator = Paginator(fundRetInfo, pageSize)
    contacts = pageInator.page(pageIndex)
    results['data'] = contacts.object_list
    results['total'] = len(fundRetInfo)
    results['fundRetInfo'] = fundRetInfo
    results['totalData'] = totalData

    return JsonResponse({
        "code": 0,
        "msg": "成功",
        "data": results,
        "total": 0
    })

# 收益曲线
def getPnlDataSeries(request):
    today = datetime.today()  # 获取当前日期
    params = request.GET
    dateRange = params.get("date")
    sectorCheck = params.get("sector", "全部")
    investPurposeCheck = params.get("investPurpose", "全部")
    strategyCheck = params.get("strategy", "全部")
    print(investPurposeCheck)
    if dateRange == '' or dateRange is None:
        begDate = str(today.year) + "-01-01"
        endDate = today.strftime("%Y-%m-%d")
    else:
        begDate = dateRange[:10]  # 前端传入的时间
        endDate = dateRange[-10:]

    results = {
        "total": 0,
        "data": [],
        "fundRetInfo": []

    }
    queryset = fundBasicInfo.objects.filter(confirmDate2__lte=endDate).values()

    if investPurposeCheck != '全部':
        queryset = queryset.filter(investPurpose=investPurposeCheck).values()
    if sectorCheck != '全部':
        queryset = queryset.filter(sector=sectorCheck).values()
    if strategyCheck != '全部':
        queryset = queryset.filter(strategy=strategyCheck).values()
    productList = []
    for query in queryset:
        productList.append(query.get('productName'))

    totalInvestAmountList = []
    totalPnlList = []

    dailyData = fundPnlInfo.objects.filter(date__lte=endDate, date__gte=begDate, productName__in=productList).values()
    dailyData = pd.DataFrame(dailyData)
    dateList = list(set(dailyData.date.tolist()))
    dateList.sort()
    for d in dateList:
        if len(dailyData.loc[dailyData.date == d]) == 0:
            todayPnl = 0
            totalInvestAmount = 0
        else:
            todayPnl = sum(dailyData.loc[dailyData.date == d].todayPnl.tolist())
            totalInvestAmount = sum(dailyData.loc[dailyData.date == d].buyCashAmount.tolist()) - sum(dailyData.loc[dailyData.date == d].sellCost.tolist())
        totalInvestAmountList.append(round(totalInvestAmount / 100000000, 2))
        if len(totalPnlList) == 0:
            totalPnlList.append(round(todayPnl / 10000, 2))
        else:
            totalPnlList.append(round(totalPnlList[-1]+round(todayPnl / 10000, 2),2))

    results['dateList'] = dateList
    results['totalPnlList'] = totalPnlList
    results['totalInvestAmountList'] = totalInvestAmountList

    return JsonResponse({
        "code": 0,
        "msg": "成功",
        "data": results,
        "total": 0
    })
# 基金综合止损查询
def fundLossInfo(request):
    params = request.GET
    print(params)
    date = params.get("date", None)
    investPurpose = params.get("investPurpose", '全部')
    sector = params.get("sector", '全部')
    strategy = params.get("strategy", '全部')
    productType1 = params.get("productType1", '全部')
    manager = params.get("manager", '全部')
    redeemLimit = params.get("redeemLimit", '全部')
    onlyCashMgt = params.get("onlyCashMgt", '全部')

    # 对传参进行处理，非空值
    if date == '' or date is None:
        date = datetime.today().strftime("%Y-%m-%d")

    queryset = fundBasicInfo.objects.filter(confirmDate2__lte=date).values()
    if investPurpose != '全部':
        queryset = queryset.filter(investPurpose=investPurpose).values()
    if sector != '全部':
        queryset = queryset.filter(sector=sector).values()
    if manager != '全部':
        queryset = queryset.filter(manager=manager).values()
    if strategy != '全部':
        queryset = queryset.filter(strategy=strategy).values()
    if productType1 != '全部':
        queryset = queryset.filter(productType1=productType1).values()
    if redeemLimit != '全部':
        queryset = queryset.filter(redeemLimit=redeemLimit).values()
    if onlyCashMgt != '全部':
        queryset = queryset.filter(onlyCashMgt=onlyCashMgt).values()
    fundLossInfo = []
    lossAmt = 0
    investLossAmt = 0
    amt = 0
    for query in queryset:
        dicts = {}
        productName = query.get('productName')

        dicts['productName'] = query.get('productName')
        dicts['manager'] = manager
        dicts['sector'] = query.get('sector')
        confirmDate2 = query.get('confirmDate2')

        dicts['investPurpose'] = query.get('investPurpose')
        dicts['productType1'] = query.get('productType1')
        dicts['strategy'] = query.get('strategy')
        dicts['lowRisk'] = query.get('lowRisk')
        dicts['redeemLimit'] = query.get('redeemLimit')
        dicts['onlyCashMgt'] = query.get('onlyCashMgt')
        totalAmount = query.get('totalAmount')


        buyCashAmountResult, sellCost, investAmountResult = investAmount.getInvestAmount(date, productName)
        dicts['invest'] = investAmountResult
        dicts['investable'] = totalAmount + investAmountResult - buyCashAmountResult

        if productName not in nonInvestProductList:
            if buyCashAmountResult == 0:
                dicts['status'] = '未结束'
            else:
                if investAmountResult == 0:
                    dicts['status'] = '已结束'
                    continue
                else:
                    dicts['status'] = '在投'
        else:
            dicts['status'] = '取消投资'
            continue
        rmAlertLimit = query.get('rmAlertLimit')
        dicts['rmAlertLimit'] = rmAlertLimit
        rmCleanLimit = query.get('rmCleanLimit')
        dicts['rmCleanLimit'] = rmCleanLimit

        dicts['lossAmt'] = round((1-rmCleanLimit) * (totalAmount + investAmountResult - buyCashAmountResult))
        dicts['investLossAmt'] = round((1-rmCleanLimit) * investAmountResult)
        lossAmt = lossAmt + (1-rmCleanLimit) * (totalAmount + investAmountResult - buyCashAmountResult)
        investLossAmt = investLossAmt + (1-rmCleanLimit) * investAmountResult
        amt = amt + totalAmount + investAmountResult - buyCashAmountResult
        # 将数据添加到返回给前端的列表中
        fundLossInfo.append(dicts)

    totalData = []
    dicts = {}
    dicts['date'] = date
    if amt == 0:
        dicts['lossLimit'] = 0
    else:
        dicts['lossLimit'] = 1-round(lossAmt/amt,4)
    dicts['lossAmt'] = lossAmt
    dicts['investLossAmt'] = investLossAmt
    totalData.append(dicts)
    results = {}

    results['totalData'] = totalData
    results['fundLossInfo'] = fundLossInfo
    print(queryset)
    return JsonResponse({
        "code": 0,
        "msg": "成功",
        "data": results,
        "total": 0
    })

# ===============================================   风控检查   =======================================================
# 主页风控检查
def checkRisk(request):
    params = request.GET
    print(params)
    page = params.get('page', 1)
    limit = params.get('limit', 10)
    date = params.get("date", None)
    calcMethod = params.get("calcMethod", "在投")

    dataList = []
    if date:
        dic = {}
        # 公司限额
        query = dailyFinanceData.objects.filter(date=date).first()
        dic['cashAmt'] = round(query.cashAmt / 10000, 4)
        dic['netECratio_sup'] = round(query.netECratio_sup * 100, 0)
        dic['netEAratio_sup'] = round(query.netEAratio_sup * 100, 0)
        dic['liqALratio_sup'] = round(query.liqALratio_sup * 100, 0)
        dic['netLAratio_sup'] = round(query.netLAratio_sup * 100, 0)

        managerData = {}
        brokeManagerData = {}
        amManagerData = {}
        hedgeProductList = []
        fixedProductList = []
        equityProductList = []

        amLowRiskList = []
        amOtherList = []
        amHedgeList = []
        amEquityList = []
        amFixList = []

        brokeLowRiskList = []
        brokeOtherList = []
        brokeHedgeList = []
        brokeEquityList = []
        brokeFixList = []

        amCashDelta = 0
        brokeCashDelta = 0

        hedgeAmt = 0
        fixedAmt = 0
        equityAmt = 0
        amLowRiskAmtList = 0
        amOtherAmtList = 0
        brokeLowRiskAmtList = 0
        brokeOtherAmtList = 0
        amHedgeAmtList = 0
        amEquityAmtList = 0
        amFixAmtList = 0
        brokeHedgeAmtList = 0
        brokeEquityAmtList = 0
        brokeFixAmtList = 0

        if calcMethod == '含拟投':
            productData = fundBasicInfo.objects.filter(confirmDate2__lte=date).all()
        else:
            productData = fundBasicInfo.objects.all()
        for query in productData:
            manager = query.manager
            deltaRatio = query.deltaRatio
            if calcMethod == '含拟投':
                # 查历史的，有近期赎回的，数据有误
                # amt = query.totalAmount - query.redeemCost
                # 查tradeinfo表，查日期<=今日的赎回成本，如果为0，赎回成本为0
                trade = tradeInfo.objects.filter(confirmDate__lte=date, productName=query.productName, tradeType='赎回').all()
                if len(trade) == 0:
                    redeemCost = 0
                else:
                    redeemCost = trade.aggregate(Sum('cost')).get('cost__sum')
                trade = tradeInfo.objects.filter(confirmDate__lte=date, productName=query.productName, tradeType='申购').all()
                if len(trade) == 0:
                    buyCost = 0
                else:
                    buyCost = trade.aggregate(Sum('tradeAmount')).get('tradeAmount__sum')
                # 因赎回全部申购份额，导致产品结束（申购=赎回，但总额度-赎回成本 ！= 0）
                if redeemCost == buyCost and buyCost != 0:
                    amt = 0
                else:
                    amt = query.totalAmount - redeemCost
            else:
                pnl = fundPnlInfo.objects.filter(date=date, productName=query.productName).all()
                if len(pnl) == 0:
                    amt = 0
                else:
                    amt = pnl.aggregate(Sum('buyCashAmount')).get('buyCashAmount__sum') - pnl.aggregate(Sum('sellCost')).get('sellCost__sum')
            delta = amt * deltaRatio
            if manager in managerData.keys():
                managerData[manager] = managerData[manager] + amt
            else:
                managerData[manager] = amt
            if query.sector == '资产管理部':
                if manager in amManagerData.keys():
                    amManagerData[manager] = amManagerData[manager] + amt
                else:
                    amManagerData[manager] = amt
                amCashDelta = amCashDelta + delta
            else:
                if manager in brokeManagerData.keys():
                    brokeManagerData[manager] = brokeManagerData[manager] + amt
                else:
                    brokeManagerData[manager] = amt
                brokeCashDelta = brokeCashDelta + delta

            if query.strategy == '对冲套利类':
                hedgeProductList.append(query.productName)
                hedgeAmt = hedgeAmt + amt
            else:
                if query.productType1 == 'B权益类' or query.productType1 == 'C混合类' or query.productType1 == 'D商品及金融衍生品类':
                    equityProductList.append(query.productName)
                    equityAmt = equityAmt + amt
                else:
                    fixedProductList.append(query.productName)
                    fixedAmt = fixedAmt + amt

            if query.sector == '资产管理部':
                if query.strategy == '对冲套利类':
                    amHedgeList.append(query.productName)
                    amHedgeAmtList = amHedgeAmtList + amt
                else:
                    if query.productType1 == 'B权益类' or query.productType1 == 'C混合类' or query.productType1 == 'D商品及金融衍生品类':
                        amEquityList.append(query.productName)
                        amEquityAmtList = amEquityAmtList + amt
                    else:
                        amFixList.append(query.productName)
                        amFixAmtList = amFixAmtList + amt
                if query.lowRisk == '低风险':
                    amLowRiskList.append(query.productName)
                    amLowRiskAmtList = amLowRiskAmtList + amt
                else:
                    amOtherList.append(query.productName)
                    amOtherAmtList = amOtherAmtList + amt
            else:
                if query.strategy == '对冲套利类':
                    brokeHedgeList.append(query.productName)
                    brokeHedgeAmtList = brokeHedgeAmtList + amt
                else:
                    if query.productType1 == 'B权益类' or query.productType1 == 'C混合类' or query.productType1 == 'D商品及金融衍生品类':
                        brokeEquityList.append(query.productName)
                        brokeEquityAmtList = brokeEquityAmtList + amt
                    else:
                        brokeFixList.append(query.productName)
                        brokeFixAmtList = brokeFixAmtList + amt
                if query.lowRisk == '低风险':
                    brokeLowRiskList.append(query.productName)
                    brokeLowRiskAmtList = brokeLowRiskAmtList + amt
                else:
                    brokeOtherList.append(query.productName)
                    brokeOtherAmtList = brokeOtherAmtList + amt
        dic['managerAmt'] = round(max(managerData.values()) / 100000000, 4)
        year = datetime.strptime(date, "%Y-%m-%d").year
        pnl = fundPnlInfo.objects.filter(date=date).all()
        dic['productAmt'] = round((hedgeAmt + fixedAmt + equityAmt) / 100000000, 4)
        dic['brokeCashDelta'] = round((brokeCashDelta) / 100000000, 4)
        dic['amCashDelta'] = round((amCashDelta) / 100000000, 4)
        dic['productCashDelta'] = round((brokeCashDelta + amCashDelta) / 100000000, 4)

        amLowRiskPnlList = []
        amOtherPnlList = []
        brokeLowRiskPnlList = []
        brokeOtherPnlList = []
        brokeLowRiskLimitNum = 0
        brokeOtherLimitNum = 0
        amLowRiskLimitNum = 0
        amOtherLimitNum = 0
        for query in pnl:

            if query.productName in amLowRiskList:
                pnl = fundPnlInfo.objects.filter(date__lte=date,productName=query.productName).order_by("-date").all()
                pnlYear = pnl.filter(date__year=year).aggregate(Sum('todayPnl'))
                amLowRiskPnlList.append(round(pnlYear.get('todayPnl__sum') / 100000000, 4))
                if pnlYear.get('todayPnl__sum') <= -(query.buyCashAmount - query.sellCost) * 0.03 and (query.buyCashAmount - query.sellCost) !=0:
                    amLowRiskLimitNum = amLowRiskLimitNum + 1
            elif query.productName in amOtherList:
                pnl = fundPnlInfo.objects.filter(date__lte=date, productName=query.productName).order_by("-date").all()
                pnlYear = pnl.filter(date__year=year).aggregate(Sum('todayPnl'))
                amOtherPnlList.append(round(pnlYear.get('todayPnl__sum') / 100000000, 4))
                if pnlYear.get('todayPnl__sum') <= min(-(query.buyCashAmount - query.sellCost) * 0.15, -5000000) and (query.buyCashAmount - query.sellCost) !=0:
                    amOtherLimitNum = amOtherLimitNum + 1
            elif query.productName in brokeLowRiskList:
                pnl = fundPnlInfo.objects.filter(date__lte=date, productName=query.productName).order_by("-date").all()
                pnlYear = pnl.filter(date__year=year).aggregate(Sum('todayPnl'))
                brokeLowRiskPnlList.append(round(pnlYear.get('todayPnl__sum') / 100000000, 4))
                if pnlYear.get('todayPnl__sum') <= -(query.buyCashAmount - query.sellCost) * 0.03 and (query.buyCashAmount - query.sellCost) !=0:
                    brokeLowRiskLimitNum = brokeLowRiskLimitNum + 1
            elif query.productName in brokeOtherList:
                pnl = fundPnlInfo.objects.filter(date__lte=date, productName=query.productName).order_by("-date").all()
                pnlYear = pnl.filter(date__year=year).aggregate(Sum('todayPnl'))
                brokeOtherPnlList.append(round(pnlYear.get('todayPnl__sum') / 100000000, 4))
                if pnlYear.get('todayPnl__sum') <= min(-(query.buyCashAmount - query.sellCost) * 0.15, -3000000) and (query.buyCashAmount - query.sellCost) !=0:
                    brokeOtherLimitNum = brokeOtherLimitNum + 1

        dic['hedgeAmt'] = round(hedgeAmt/ 100000000, 4)
        dic['fixedAmt'] = round(fixedAmt / 100000000, 4)
        dic['equityAmt'] = round(equityAmt / 100000000, 4)

        # 期货L3限额
        L3_am_lowRiskAmt = round(amLowRiskAmtList/ 100000000, 4)
        L3_am_otherAmt = round(amOtherAmtList / 100000000, 4)
        L3_am_hedgeAmt = round(amHedgeAmtList / 100000000, 4)
        L3_am_equityAmt = round(amEquityAmtList / 100000000, 4)
        L3_am_fxAmt = round(amFixAmtList / 100000000, 4)

        L3_broke_lowRiskAmt = round(brokeLowRiskAmtList/ 100000000, 4)
        L3_broke_otherAmt = round(brokeOtherAmtList/ 100000000, 4)
        L3_broke_hedgeAmt = round(brokeHedgeAmtList / 100000000, 4)
        L3_broke_equityAmt = round(brokeEquityAmtList / 100000000, 4)
        L3_broke_fxAmt = round(brokeFixAmtList / 100000000, 4)

        dic['L3_lowRiskAmt'] = round(L3_broke_lowRiskAmt + L3_am_lowRiskAmt, 4)
        dic['L3_otherAmt'] = round(L3_broke_otherAmt + L3_am_otherAmt, 4)

        dic['L3_broke_productAmt'] = round(L3_broke_lowRiskAmt + L3_broke_otherAmt, 4)
        dic['L3_broke_lowRiskAmt'] = L3_broke_lowRiskAmt
        dic['L3_broke_otherAmt'] = L3_broke_otherAmt

        dic['L3_broke_hedgeAmt'] = L3_broke_hedgeAmt
        dic['L3_broke_equityAmt'] = L3_broke_equityAmt
        dic['L3_broke_fxAmt'] = L3_broke_fxAmt

        dic['L3_broke_lowRiskMaxLoss'] = brokeLowRiskLimitNum
        dic['L3_broke_otherMaxLoss'] = brokeOtherLimitNum

        dic['L3_broke_maxLoss'] = round(sum(brokeLowRiskPnlList)+sum(brokeOtherPnlList),4)
        dic['L3_broke_singleManger'] = round(max(brokeManagerData.values()) / 100000000, 4)

        dic['L3_am_productAmt'] = round(L3_am_lowRiskAmt + L3_am_otherAmt,4)
        dic['L3_am_lowRiskAmt'] = L3_am_lowRiskAmt
        dic['L3_am_otherAmt'] = L3_am_otherAmt

        dic['L3_am_hedgeAmt'] = L3_am_hedgeAmt
        dic['L3_am_equityAmt'] = L3_am_equityAmt
        dic['L3_am_fxAmt'] = L3_am_fxAmt

        dic['L3_am_lowRiskMaxLoss'] = amLowRiskLimitNum
        dic['L3_am_otherMaxLoss'] = amOtherLimitNum

        dic['L3_am_maxLoss'] = round(sum(amLowRiskPnlList)+sum(amOtherPnlList),4)
        dic['L3_am_singleManger'] = round(max(amManagerData.values()) / 100000000, 4)

        pnl = fundPnlInfo.objects.filter(date__lte=date).order_by("-date").all()
        pnlYear = pnl.filter(date__year=year).aggregate(Sum('todayPnl'))
        if pnlYear.get('todayPnl__sum') is None:
            dic['yearPnl'] = 0.
        else:
            dic['yearPnl'] = round(pnlYear.get('todayPnl__sum') / 100000000, 4)


        # 德睿限额
        def deruiLimitCheck(date):
            query = deruiLimitData.objects.filter(date=date).first()
            dic['date'] = str(date[:4]) + '年' + str(date[5:7]) + '月' + str(int(date[8:])) + '日'
            dic['reportDate'] = str(datetime.today().year) + '年' + str(datetime.today().month) + '月' + str(
                datetime.today().day) + '日'

            dic['l1_creditAmt_nonSecBank_usable'] = round(query.l1_creditAmt_nonSecBank_usable, 4)
            dic['l1_creditAmt_nonSecBank_used'] = round(query.l1_creditAmt_nonSecBank_used, 4)
            dic['l1_creditAmt_secBank_usable'] = round(query.l1_creditAmt_secBank_usable, 4)
            dic['l1_creditAmt_secBank_used'] = round(query.l1_creditAmt_secBank_used, 4)
            dic['l1_loss'] = round(query.l1_loss, 4)
            dic['l1_cashDelta'] = round(query.l1_cashDelta, 4)
            dic['l1_var'] = round(query.l1_var, 4)
            dic['l1_assetAmt'] = round(query.l1_assetAmt * 100, 4)

            dic['l2_otc_cashDelta'] = round(query.l2_otc_cashDelta, 4)
            dic['l2_otc_singleCreditAmt_nonSecBank'] = round(query.l2_otc_singleCreditAmt_nonSecBank, 4)
            dic['l2_otc_singleCreditAmt_secBank'] = round(query.l2_otc_singleCreditAmt_secBank, 4)
            dic['l2_otc_singleNominal'] = round(query.l2_otc_singleNominal, 4)
            dic['l2_otc_creditAmt_nonSecBank'] = round(query.l2_otc_creditAmt_nonSecBank, 4)

            dic['l2_Otc_creditAmt_Specialdeals'] = round(query.l2_Otc_creditAmt_Specialdeals, 4)
            dic['l2_sigma_singlemanagerCost'] = round(query.l2_sigma_singlemanagerCost, 4)
            dic['l2_sigma_SamestrategyCost'] = round(query.l2_sigma_SamestrategyCost, 4)

            dic['l2_otc_creditAmt_secBank'] = round(query.l2_otc_creditAmt_secBank, 4)
            dic['l2_otc_loss'] = round(query.l2_otc_loss, 4)
            dic['l2_otc_var'] = round(query.l2_otc_var, 4)
            dic['l2_omm_cashDelta'] = round(query.l2_omm_cashDelta, 4)
            dic['l2_omm_loss'] = round(query.l2_omm_loss, 4)
            dic['l2_omm_var'] = round(query.l2_omm_var, 4)
            dic['l2_c_cashDelta'] = round(query.l2_c_cashDelta, 4)
            dic['l2_c_singleCreditAmt'] = round(query.l2_c_singleCreditAmt, 4)
            dic['l2_c_creditAmt_usable'] = round(query.l2_c_creditAmt_usable, 4)
            dic['l2_c_creditAmt_used'] = round(query.l2_c_creditAmt_used, 4)
            dic['l2_c_loss'] = round(query.l2_c_loss, 4)
            dic['l2_c_var'] = round(query.l2_c_var, 4)

            if query.l2_sigma_productAmt is None:
                dic['l2_sigma_productAmt'] = '/'
            else:
                dic['l2_sigma_productAmt'] = round(query.l2_sigma_productAmt, 4)
            if query.l2_sigma_productCashDelta is None:
                dic['l2_sigma_productCashDelta'] = '/'
            else:
                dic['l2_sigma_productCashDelta'] = round(query.l2_sigma_productCashDelta, 4)
            dic['l2_sigma_singleEquityAmt'] = round(query.l2_sigma_singleEquityAmt, 4)
            dic['l2_sigma_singleFIAmt'] = round(query.l2_sigma_singleFIAmt, 4)
            dic['l2_sigma_singleMixAmt'] = round(query.l2_sigma_singleMixAmt, 4)
            dic['l2_sigma_productLoss'] = round(query.l2_sigma_productLoss, 4)
            if query.l2_sigma_productVaR is None:
                dic['l2_sigma_productVaR'] = '/'
            else:
                dic['l2_sigma_productVaR'] = round(query.l2_sigma_productVaR, 4)

            dic['l2_sigma_cashDelta'] = round(query.l2_sigma_cashDelta, 4)
            dic['l2_sigma_loss'] = round(query.l2_sigma_loss, 4)
            dic['l2_sigma_var'] = round(query.l2_sigma_var, 4)

            return dic
        dic = deruiLimitCheck(date)
        dataList.append(dic)
        if query:
            result = {
                "code": 2000,
                "msg": "查询成功",
                "data": dataList
            }
        else:
            result = {
                "code": 0,
                "msg": "无数据",
                "data": None
            }
    else:
        result = {
            "code": 0,
            "msg": "无数据",
            "data": None
        }
    return JsonResponse(result)

# 主页风控检查：产品盈亏超限状态
def checkProductSituation(request):
    params = request.GET
    print(params)
    page = params.get('page', 1)
    limit = params.get('limit', 10)
    date = params.get("date", None)

    results = {
        "total": 0,
        "data": [],
        "tips": ''

    }
    productSituation = []
    tips = '公司自有资金投资产品状态正常'
    if date:

        querySet = fundPnlInfo.objects.filter(date=date).all()
        for query in querySet:
            dic = {}
            productName = query.productName
            basicInfo = fundBasicInfo.objects.filter(productName=productName).first()
            if basicInfo.status == '已结束':
                continue
            dic['productName'] = productName
            dic['sector'] = basicInfo.sector
            pnl = fundPnlInfo.objects.filter(productName=productName).filter(date__lte=date).all()
            pnlTotal = pnl.aggregate(Sum('todayPnl'))
            if pnlTotal.get('todayPnl__sum') is None:
                totalPnl = 0.
            else:
                totalPnl = pnlTotal.get('todayPnl__sum')

            dic['totalPnl'] = round(totalPnl / 10000, 2)
            dic['situation'] = '正常'
            if basicInfo.rmAlertLimit is None:
                dic['alert'] = '/'
            else:
                dic['alert'] = round(basicInfo.totalAmount * (basicInfo.rmAlertLimit - 1) / 10000, 2)
                if totalPnl <= basicInfo.totalAmount * (basicInfo.rmAlertLimit - 1):
                    dic['situation'] = '触及预警线'
                    tips = '公司自有资金投资产品触及预警线'
            if basicInfo.rmCleanLimit is None:
                dic['clean'] = '/'
            else:
                dic['clean'] = round(basicInfo.totalAmount * (basicInfo.rmCleanLimit - 1) / 10000, 2)
                if totalPnl <= basicInfo.totalAmount * (basicInfo.rmCleanLimit - 1):
                    dic['situation'] = '触及清盘线'
                    tips = '公司自有资金投资产品触及清盘线'
            productSituation.append(dic)

        results['total'] = len(productSituation)
        results['productSituation'] = productSituation
        results['tips'] = tips

    return JsonResponse({
        "code": 0,
        "msg": "成功",
        "data": results,
        "total": 0
    })


# 数据分析-德睿业务分析：计算各业务最大回撤
def checkDeruiSector(request):
    params = request.GET
    print(params)
    date = params.get("date", None)

    results = {
        "total": 0,
        "data": [],
        "tips": ''

    }
    if date:
        data = deruiSector.getData(date)
        total_beg, total_end, total_cumPnl, total_limit, total_d, totalDf = deruiSector.total(data)
        results['total_limit'] = -round(total_limit, 2)
        results['total_d'] = round(total_d, 2)
        results['total_cumPnl'] = round(total_cumPnl, 2)
        results['total_beg'] = total_beg.strftime("%Y-%m-%d")
        results['total_end'] = total_end.strftime("%Y-%m-%d")

        otc_beg, otc_end, otc_cumPnl, otc_limit, otc_d, totalDf = deruiSector.otc(data)
        results['otc_limit'] = -round(otc_limit, 2)
        results['otc_d'] = round(otc_d, 2)
        results['otc_cumPnl'] = round(otc_cumPnl, 2)
        results['otc_beg'] = otc_beg.strftime("%Y-%m-%d")
        results['otc_end'] = otc_end.strftime("%Y-%m-%d")

        omm_beg, omm_end, omm_cumPnl, omm_limit, omm_d, totalDf = deruiSector.omm(data)
        results['omm_limit'] = -round(omm_limit, 2)
        results['omm_d'] = round(omm_d, 2)
        results['omm_beg'] = omm_beg.strftime("%Y-%m-%d")
        results['omm_cumPnl'] = round(omm_cumPnl, 2)
        results['omm_end'] = omm_end.strftime("%Y-%m-%d")

        c_beg, c_end, c_cumPnl, c_limit, c_d, totalDf = deruiSector.c(data)
        results['c_limit'] = -round(c_limit, 2)
        if str(c_d) == 'nan':
            results['c_d'] = '-'
        else:
            results['c_d'] = round(c_d, 2)
        results['c_beg'] = c_beg.strftime("%Y-%m-%d")
        results['c_cumPnl'] = round(c_cumPnl, 2)
        results['c_end'] = c_end.strftime("%Y-%m-%d")

        sigma_beg, sigma_end, sigma_cumPnl, sigma_limit, sigma_d, totalDf = deruiSector.sigma(data)
        results['sigma_limit'] = -round(sigma_limit, 2)
        results['sigma_d'] = round(sigma_d, 2)
        results['sigma_beg'] = sigma_beg.strftime("%Y-%m-%d")
        results['sigma_cumPnl'] = round(sigma_cumPnl, 2)
        results['sigma_end'] = sigma_end.strftime("%Y-%m-%d")
    return JsonResponse({
        "code": 0,
        "msg": "成功",
        "data": results,
        "total": 0
    })

# 数据分析-德睿业务分析：场外数据补充
def addOtcData(request):
    dataDate = request.POST.get('dataDate', "")

    otcCommFund = float(request.POST.get('otcCommFund', 0))
    otcFinFund = float(request.POST.get('otcFinFund', 0))
    otcOthersFund = float(request.POST.get('otcOthersFund', 0))

    otcAmt = deruisectordata.objects.filter(date=dataDate).first().otcAmt
    otcMargin = otcCommFund + otcFinFund + otcOthersFund - otcAmt

    deruisectordata.objects.filter(date=dataDate).update(otcAmt_comm_fund=otcCommFund)
    deruisectordata.objects.filter(date=dataDate).update(otcAmt_fin_fund=otcFinFund)
    deruisectordata.objects.filter(date=dataDate).update(otcAmt_other_fund=otcOthersFund)
    deruisectordata.objects.filter(date=dataDate).update(otcMargin=otcMargin)

    return redirect('dataAnalysis/deruiSectorAnalysis')

# 数据分析-德睿业务分析：表格展示数据
def checkDeruiSectorEchartsView(request):
    params = request.GET
    print(params)
    date = params.get("date", None)

    dict = {}
    dateList = []
    exposureList = []
    pnlList = []
    fundList = []
    dailyPnlList = []
    varList = []

    sigmaAmt_vol = []
    sigmaCashDelta_vol = []
    sigmaPnl_vol = []
    sigmaAmt = []
    sigmaPnl = []
    otcAmt_fin = []
    otcAmt_comm = []
    otcAmt_other = []
    otcAmt = []
    otcCashDelta = []
    otcPnl = []
    cAmt_basic = []
    cAmt_fund = []
    cAmt = []
    cCashDelta = []
    cPnl = []
    ommAmt_fut = []
    ommAmt_opt = []
    ommAmt = []
    ommCashDelta = []
    ommPnl = []
    newYear = False
    if date:
        dataList = deruisectordata.objects.filter(date__lte=date).order_by('-date').all()[:252]
        for data in dataList:
            date = data.date.strftime("%Y-%m-%d")
            if len(dateList) != 0:
                if date[:4] != dateList[-1][:4]:
                    newYear = True
                else:
                    newYear = False
            dateList.append(date)
            exposureList.append(data.totalCashDelta)
            pnlList.append(data.totalPnl)
            if len(pnlList) == 1:
                # 倒序第一天
                dailyPnlList.append(0)
                if data.otcAmt_fin_fund is None:
                    otcAmt_fin_fund = data.otcAmt_fin_fund
                    otcAmt_comm_fund = data.otcAmt_comm_fund
                    otcAmt_other_fund = data.otcAmt_other_fund
                else:
                    otcAmt_fin_fund = round(data.otcAmt_fin_fund/10000,2)
                    otcAmt_comm_fund = round(data.otcAmt_comm_fund/10000,2)
                    otcAmt_other_fund = round(data.otcAmt_other_fund/10000,2)
                if data.otcMargin is None:
                    otcMargin = '-'
                else:
                    otcMargin = round(data.otcMargin/10000,2)
            else:
                if newYear:
                    dailyPnlList.append(pnlList[-2])
                else:
                    dailyPnlList.append(pnlList[-2] - pnlList[-1])
            varList.append(data.totalVar)
            fundList.append(data.otcAmt + data.ommAmt + data.sigmaAmt + data.cAmt)

            sigmaAmt_vol.append(data.sigmaAmt_vol)
            sigmaCashDelta_vol.append(data.sigmaCashDelta_vol)
            sigmaPnl_vol.append(data.sigmaPnl_vol)
            sigmaAmt.append(data.sigmaAmt)
            sigmaPnl.append(data.sigmaPnl)

            otcAmt_fin.append(data.otcAmt_fin)
            otcAmt_comm.append(data.otcAmt_comm)
            otcAmt_other.append(data.otcAmt_other)
            otcAmt.append(data.otcAmt)
            otcCashDelta.append(data.otcCashDelta)
            otcPnl.append(data.otcPnl)

            cAmt_basic.append(data.cAmt_basic)
            cAmt_fund.append(data.cAmt_fund)
            cAmt.append(data.cAmt)
            cCashDelta.append(data.cCashDelta)
            cPnl.append(data.cPnl)

            ommAmt_fut.append(data.ommAmt_fut)
            ommAmt_opt.append(data.ommAmt_opt)
            ommAmt.append(data.ommAmt)
            ommCashDelta.append(data.ommCashDelta)
            ommPnl.append(data.ommPnl)
        dateList.reverse()
        exposureList.reverse()
        pnlList.reverse()
        dailyPnlList.reverse()
        varList.reverse()
        fundList.reverse()

        sigmaAmt_vol.reverse()
        sigmaCashDelta_vol.reverse()
        sigmaPnl_vol.reverse()
        sigmaAmt.reverse()
        sigmaPnl.reverse()
        otcAmt_fin.reverse()
        otcAmt_comm.reverse()
        otcAmt_other.reverse()
        otcAmt.reverse()
        otcCashDelta.reverse()
        otcPnl.reverse()
        cAmt_basic.reverse()
        cAmt_fund.reverse()
        cAmt.reverse()
        cCashDelta.reverse()
        cPnl.reverse()
        ommAmt_fut.reverse()
        ommAmt_opt.reverse()
        ommAmt.reverse()
        ommCashDelta.reverse()
        ommPnl.reverse()

        dict['date'] = dateList
        dict['exposure'] = exposureList
        dict['pnl'] = pnlList
        dict['dailyPnlList'] = [0]+dailyPnlList[:-1]
        dict['varList'] = varList
        dict['fund'] = fundList

        dict['sigmaAmt_vol'] = sigmaAmt_vol
        dict['sigmaCashDelta_vol'] = sigmaCashDelta_vol
        dict['sigmaPnl_vol'] = sigmaPnl_vol
        dict['sigmaAmt'] = sigmaAmt
        dict['sigmaPnl'] = sigmaPnl
        dict['otcAmt_fin'] = otcAmt_fin[-1]
        dict['otcAmt_comm'] = otcAmt_comm[-1]
        dict['otcAmt_other'] = otcAmt_other[-1]
        dict['otcAmt'] = otcAmt
        dict['otcCashDelta'] = otcCashDelta
        dict['otcPnl'] = otcPnl
        dict['cAmt_basic'] = cAmt_basic
        dict['cAmt_fund'] = cAmt_fund
        dict['cAmt'] = cAmt
        dict['cCashDelta'] = cCashDelta
        dict['cPnl'] = cPnl
        dict['ommAmt_fut'] = ommAmt_fut
        dict['ommAmt_opt'] = ommAmt_opt
        dict['ommAmt'] = ommAmt
        dict['ommCashDelta'] = ommCashDelta
        dict['ommPnl'] = ommPnl

        dict['daySectorFund'] = [otcAmt[-1], ommAmt[-1], sigmaAmt[-1], cAmt[-1]]
        dict['daySectorPnl'] = [otcPnl[-1], ommPnl[-1], sigmaPnl[-1], cPnl[-1]]

        dict['otcAmt_fin_fund'] = otcAmt_fin_fund
        dict['otcAmt_comm_fund'] = otcAmt_comm_fund
        dict['otcAmt_other_fund'] = otcAmt_other_fund
        dict['otcMargin'] = otcMargin
        result = {
            "code": 2000,
            "msg": "查询成功",
            "data": dict
        }
    else:
        result = {
            "code": 0,
            "msg": "无数据",
            "data": None
        }
    return JsonResponse(result)


# 数据分析-公司业务分析：未完成
def postSctorFundResult(request):
    """批量导入数据"""
    # if request.method == "POST":
    fileName = request.FILES.get('file')
    data = pd.read_excel(fileName, None)
    date = fileName.name[-13:-5]
    dic = {}
    dic['date'] = datetime.strptime(str(date), "%Y%m%d")
    if '产品投资明细' in data.keys():
        df1 = data['产品投资明细']
        df1.columns = df1.iloc[2]
        if '自有资金现金管理' in df1.iloc[4].values:
            dic['cashAmt'] = df1.iloc[4].在投产品规模
            dic['cashNum'] = df1.iloc[4].在投产品只数
            dic['cashQuartPnl'] = df1.iloc[4].当季盈亏
            dic['cashYearPnl'] = df1.iloc[4].当年盈亏
            dic['cashCumPnl'] = df1.iloc[4].累计盈亏
        if '自有资金投资产品' in df1.iloc[3].values:
            dic['productAmt'] = df1.iloc[3].在投产品规模
            dic['productNum'] = df1.iloc[3].在投产品只数
            dic['productYearPnl'] = df1.iloc[3].当年盈亏
            dic['productCumPnl'] = df1.iloc[3].累计盈亏
    if '风险监管指标填报' in data.keys():
        df2 = data['风险监管指标填报']
        df2.columns = df2.iloc[0]
        dic['netEquity'] = df2.loc[df2.指标名称 == '净资本'].指标执行值.values[0]
        dic['netAsset'] = df2.loc[df2.指标名称 == '净资产'].指标执行值.values[0]
        dic['netEAratio'] = df2.loc[df2.指标名称 == '净资本/净资产'].指标执行值.values[0]
        dic['riskCapital'] = df2.loc[df2.指标名称 == '风险资本准备总额'].指标执行值.values[0]
        dic['coverRatio'] = df2.loc[df2.指标名称 == '风险覆盖率'].指标执行值.values[0]

        dic['netECratio_sup'] = df2.loc[df2.指标名称 == '净资本/风险准备金总额'].指标执行值.values[0]
        dic['netEAratio_sup'] = df2.loc[df2.指标名称 == '净资本/净资产'].指标执行值.values[0]
        dic['liqALratio_sup'] = df2.loc[df2.指标名称 == '流动资产/流动负债'].指标执行值.values[0]
        dic['netLAratio_sup'] = df2.loc[df2.指标名称 == '负债/净资产'].指标执行值.values[0]

    dfData = pd.DataFrame(dic, index=[0])
    dfData = dfData.replace('', float('nan'))

    # engine = create_engine("mysql+pymysql://root:123456@localhost/djangotest", encoding="utf8")
    # pd.io.sql.to_sql(dfData.reset_index(drop=True), 'dailySectorFundResult', engine, schema='djangotest', if_exists='append')

    return JsonResponse({
        "code": 0,
        "msg": "成功",
        "data": {}
    })



# ================================================     TEST2     =======================================================
def productApi(request):
    params = request.GET
    manager = params.get("manager", None)
    if manager:
        queryset = fundBasicInfo.objects.filter(manager=manager).values()
        if queryset:
            result = {
                "code": 2000,
                "msg": "查询成功",
                "data": list(queryset)[0]
            }
        else:
            result = {
                "code": 0,
                "msg": "无数据",
                "data": None
            }
    else:
        result = {
            "code": 0,
            "msg": "无数据",
            "data": None
        }
    return JsonResponse(result)


def addProduct(request):
    params = request.GET

    productName = params.get("productName", None)
    manager = params.get("manager", None)
    sector = params.get("sector", None)
    print(productName)
    results = {
        'total': 0,
        'fundBasicInfoData': []
    }
    dicts = {}
    fundBasicInfoData = []
    if productName:
        fundBasicInfo.objects.filter(productName=productName).update(manager=manager)
        # fundBasicInfo.objects.filter(productName=productName).update(status=status)
        fundBasicInfo.objects.filter(productName=productName).update(sector=sector)
        query = fundBasicInfo.objects.filter(productName=productName).values()

        dicts['date'] = query.get('date')
        dicts['productName'] = query.get('productName')
        dicts['productFullName'] = query.get('productFullName')
        dicts['manager'] = query.get('manager')
        dicts['sector'] = query.get('sector')
        # 将数据添加到返回给前端的列表中
        # print(query)
    fundBasicInfoData.append(dicts)

    results['total'] = len(fundBasicInfoData)
    results['fundBasicInfoData'] = fundBasicInfoData

    return JsonResponse({
        "code": 0,
        "msg": "成功",
        "data": results,
        "total": 0
    })

