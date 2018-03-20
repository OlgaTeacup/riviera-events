'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Événements Côte d\'Azur';
const expectedTitle = `${expectedH1}`;
const targetEvent = { id: 15, name: 'Magneta' };
const nameSuffix = 'X';
const newEventName = targetEvent.name + nameSuffix;

class Event {
  id: number;
  name: string;

  // Factory methods

  // Event from string formatted as '<id> <name>'.
  static fromString(s: string): Event {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Event from event list <li> element.
  static async fromLi(li: ElementFinder): Promise<Event> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Event id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Event> {
    // Get event id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appEventsHref: navElts.get(1),
      appEvents: element(by.css('app-root app-events')),
      allEvents: element.all(by.css('app-root app-events li')),
      selectedEventSubview: element(by.css('app-root app-events > div:last-child')),

      eventDetail: element(by.css('app-root app-event-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Events'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has event as the active view', () => {
      let page = getPageElts();
      expect(page.appEvents.isPresent()).toBeTruthy();
    });

  });

  describe('Events tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Events view', () => {
      getPageElts().appEventsHref.click();
      let page = getPageElts();
      expect(page.appEvents.isPresent()).toBeTruthy();
      expect(page.allEvents.count()).toEqual(10, 'number of events');
    });

    it('can route to event details', async () => {
      getEventLiEltById(targetEvent.id).click();

      let page = getPageElts();
      expect(page.eventDetail.isPresent()).toBeTruthy('shows event detail');
      let event = await Event.fromDetail(page.eventDetail);
      expect(event.id).toEqual(targetEvent.id);
      expect(event.name).toEqual(targetEvent.name.toUpperCase());
    });

    it(`updates event name (${newEventName}) in details view`, updateEventNameInDetailView);

    it(`shows ${newEventName} in Events list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      let expectedText = `${targetEvent.id} ${newEventName}`;
      expect(getEventAEltById(targetEvent.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newEventName} from Events list`, async () => {
      const eventsBefore = await toEventArray(getPageElts().allEvents);
      const li = getEventLiEltById(targetEvent.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appEvents.isPresent()).toBeTruthy();
      expect(page.allEvents.count()).toEqual(9, 'number of events');
      const eventsAfter = await toEventArray(page.allEvents);
      // console.log(await Event.fromLi(page.allEvents[0]));
      const expectedEvents =  eventsBefore.filter(h => h.name !== newEventName);
      expect(eventsAfter).toEqual(expectedEvents);
      // expect(page.selectedEventSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetEvent.name}`, async () => {
      const newEventName = 'Alice';
      const eventsBefore = await toEventArray(getPageElts().allEvents);
      const numEvents = eventsBefore.length;

      element(by.css('input')).sendKeys(newEventName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let eventsAfter = await toEventArray(page.allEvents);
      expect(eventsAfter.length).toEqual(numEvents + 1, 'number of events');

      expect(eventsAfter.slice(0, numEvents)).toEqual(eventsBefore, 'Old events are still there');

      const maxId = eventsBefore[eventsBefore.length - 1].id;
      expect(eventsAfter[numEvents]).toEqual({id: maxId + 1, name: newEventName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in events.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive event search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetEvent.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let event = page.searchResults.get(0);
      expect(event.getText()).toEqual(targetEvent.name);
    });

    it(`navigates to ${targetEvent.name} details view`, async () => {
      let event = getPageElts().searchResults.get(0);
      expect(event.getText()).toEqual(targetEvent.name);
      event.click();

      let page = getPageElts();
      expect(page.eventDetail.isPresent()).toBeTruthy('shows event detail');
      let event2 = await Event.fromDetail(page.eventDetail);
      expect(event2.id).toEqual(targetEvent.id);
      expect(event2.name).toEqual(targetEvent.name.toUpperCase());
    });
  });

  async function updateEventNameInDetailView() {
    // Assumes that the current view is the event details view.
    addToEventName(nameSuffix);

    let page = getPageElts();
    let event = await Event.fromDetail(page.eventDetail);
    expect(event.id).toEqual(targetEvent.id);
    expect(event.name).toEqual(newEventName.toUpperCase());
  }

});

function addToEventName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getEventAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getEventLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toEventArray(allEvents: ElementArrayFinder): Promise<Event[]> {
  let promisedEvents = await allEvents.map(Event.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedEvents);
}
