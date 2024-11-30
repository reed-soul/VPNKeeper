import { setupAlarm, handleAlarm } from '../../background/alarm';
import { pingVPN } from '../../background/ping';

jest.mock('../../background/ping');

describe('Alarm Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setupAlarm', () => {
    it('should create alarm with default interval', async () => {
      await setupAlarm();
      expect(chrome.alarms.create).toHaveBeenCalledWith('vpnKeeper', {
        periodInMinutes: 10,
      });
    });

    it('should create alarm with custom interval', async () => {
      await setupAlarm(5);
      expect(chrome.alarms.create).toHaveBeenCalledWith('vpnKeeper', {
        periodInMinutes: 5,
      });
    });
  });

  describe('handleAlarm', () => {
    it('should call pingVPN when alarm name matches', () => {
      handleAlarm({ name: 'vpnKeeper' } as chrome.alarms.Alarm);
      expect(pingVPN).toHaveBeenCalled();
    });

    it('should not call pingVPN when alarm name does not match', () => {
      handleAlarm({ name: 'other' } as chrome.alarms.Alarm);
      expect(pingVPN).not.toHaveBeenCalled();
    });
  });
}); 