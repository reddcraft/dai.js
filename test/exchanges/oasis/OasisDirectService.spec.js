import { buildTestService } from '../../helpers/serviceBuilders';
import {
  setProxyAccount,
  setExistingAccount
} from '../../helpers/proxyHelpers';
import TestAccountProvider from '../../helpers/TestAccountProvider';
import addresses from '../../../contracts/addresses/testnet.json';
import tokens from '../../../contracts/tokens';
import Maker from '../../../src/index';
import createDaiAndPlaceLimitOrder from '../../helpers/oasisHelpers';

let service, proxyAccount, maker;

async function buildTestOasisDirectService() {
  service = buildTestService('exchange', {
    exchange: 'OasisDirectService'
  });
  await service.manager().authenticate();
}

function proxy() {
  return service.get('proxy').currentProxy();
}

function setMockTradeState() {
  service._operation = 'sellAllAmount';
  service._payToken = 'DAI';
  service._buyToken = 'WETH';
  service._value = 1;
}

function currentAccount() {
  return service
    .get('smartContract')
    .get('web3')
    .currentAccount();
}

beforeEach(async () => {
  await buildTestOasisDirectService();
});

test('get token addresses', () => {
  expect(service._getContractAddress('MKR')).toEqual(addresses.GOV);
  expect(service._getContractAddress('WETH')).toEqual(addresses.GEM);
  expect(service._getContractAddress('PETH')).toEqual(addresses.SKR);
  expect(service._getContractAddress('DAI')).toEqual(addresses.SAI);
  expect(service._getContractAddress('MKR_OTC')).toEqual(addresses.MKR_OTC);
});

test('get token balances', async () => {
  const balance = await service.getBalance('WETH');
  expect(balance.toString()).toEqual('0.00 WETH');
});

test.only('get buy amount', async () => {
  setMockTradeState();
  await createDaiAndPlaceLimitOrder(service);
  const buyAmount = await service.getBuyAmount();
  console.log('buyAmount:', buyAmount.toString());
});

describe('trade with existing dsproxy', () => {
  // beforeEach(async () => {
  //   if (!proxyAccount) {
  //     proxyAccount = TestAccountProvider.nextAccount();
  //   }
  //   await setProxyAccount(service, proxyAccount.address, proxyAccount.key);
  //   await service
  //     .get('token')
  //     .getToken(tokens.WETH)
  //     .deposit(20);
  //   if (!(await proxy())) await service.get('proxy').build();
  // });

  test('sell all amount', async () => {
    await service.sellAllAmount('WETH', 'DAI', 20);
  });

  test('sell all amount, pay eth', async () => {
    await service.sellAllAmountPayEth('DAI', 200, { value: 1 });
  });

  xtest('sell all amount, buy eth', async () => {});

  test('buy all amount', async () => {
    await service.buyAllAmount('DAI', 'MKR', 20);
  });

  xtest('buy all amount, pay eth', async () => {});

  xtest('buy all amount, buy eth', async () => {});
});

describe('create dsproxy and execute', () => {
  xtest('sell all amount', async () => {});

  xtest('sell all amount, pay eth', async () => {});

  xtest('sell all amount, buy eth', async () => {});

  xtest('buy all amount', async () => {});

  xtest('buy all amount, pay eth', async () => {});

  xtest('buy all amount, buy eth', async () => {});
});