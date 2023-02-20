import {
  formatCampaigns,
  filterCampaigns,
  isPatternMatchingWithURL,
} from '../campaignHelper';
import campaigns from './campaignFixtures';

global.chatwootWebChannel = {
  workingHoursEnabled: false,
};
describe('#Campaigns Helper', () => {
  describe('#isPatternMatchingWithURL', () => {
    it('returns correct value if a valid URL is passed', () => {
      expect(
        isPatternMatchingWithURL(
          'https://quicksales.vn/pricing*',
          'https://quicksales.vn/pricing/'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://*.quicksales.vn/pricing/',
          'https://app.quicksales.vn/pricing/'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://{*.}?quicksales.vn/pricing?test=true',
          'https://app.quicksales.vn/pricing/?test=true'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://{*.}?quicksales.vn/pricing*\\?*',
          'https://quicksales.vn/pricing/?test=true'
        )
      ).toBe(true);
    });
  });

  describe('formatCampaigns', () => {
    it('should return formatted campaigns if campaigns are passed', () => {
      expect(formatCampaigns({ campaigns })).toStrictEqual([
        {
          id: 1,
          timeOnPage: 3,
          triggerOnlyDuringBusinessHours: false,
          url: 'https://www.quicksales.vn/pricing',
        },
        {
          id: 2,
          triggerOnlyDuringBusinessHours: false,
          timeOnPage: 6,
          url: 'https://www.quicksales.vn/about',
        },
      ]);
    });
  });
  describe('filterCampaigns', () => {
    it('should return filtered campaigns if formatted campaigns are passed', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://www.quicksales.vn/pricing',
              triggerOnlyDuringBusinessHours: false,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://www.quicksales.vn/about',
              triggerOnlyDuringBusinessHours: false,
            },
          ],
          currentURL: 'https://www.quicksales.vn/about/',
        })
      ).toStrictEqual([
        {
          id: 2,
          timeOnPage: 6,
          url: 'https://www.quicksales.vn/about',
          triggerOnlyDuringBusinessHours: false,
        },
      ]);
    });
    it('should return filtered campaigns if formatted campaigns are passed and business hours enabled', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://www.quicksales.vn/pricing',
              triggerOnlyDuringBusinessHours: false,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://www.quicksales.vn/about',
              triggerOnlyDuringBusinessHours: true,
            },
          ],
          currentURL: 'https://www.quicksales.vn/about/',
          isInBusinessHours: true,
        })
      ).toStrictEqual([
        {
          id: 2,
          timeOnPage: 6,
          url: 'https://www.quicksales.vn/about',
          triggerOnlyDuringBusinessHours: true,
        },
      ]);
    });
    it('should return empty campaigns if formatted campaigns are passed and business hours disabled', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://www.quicksales.vn/pricing',
              triggerOnlyDuringBusinessHours: true,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://www.quicksales.vn/about',
              triggerOnlyDuringBusinessHours: true,
            },
          ],
          currentURL: 'https://www.quicksales.vn/about/',
          isInBusinessHours: false,
        })
      ).toStrictEqual([]);
    });
  });
});
