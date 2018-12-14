import * as utils from 'src/utils';
import {registerBidder} from 'src/adapters/bidderFactory';
import {BANNER, NATIVE, VIDEO} from 'src/mediaTypes';
const BIDDER_CODE = 'open8';

console.log("open8dayo");
export const spec = {
  code: BIDDER_CODE,
  aliases: ['open8'], // short code
  supportedMediaTypes: [BANNER],
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function(bid) {
    // return !!(bid.params.id);
    console.log("AA");
    console.log(bid);
    return true;
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {validBidRequests[]} - an array of bids
   * @return ServerRequest Info describing the request to the server.
   */
  buildRequests: function(validBidRequests, bidderRequest) {
    console.log('1111111');
    const url = 'http://localhost:18888';
    return validBidRequests.map(bidRequest => {
      // const params = bidRequest.params;
      // const size = bidRequest.size;
      // const area = bidRequest.area;
      // const medium = bidRequest.medium;
      // const payload = {
      //   medium: medium,
      //   area: area,
      //   size: size
      // };
      const payload = {
        name: 'value'
      };
      const payloadJson = JSON.stringify(payload);
      return {
        method: 'GET',
        url: url,
        data: payloadJson,
        bidRequest: validBidRequests[0]
      }
    })
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @param {BidRequest} bidRequests
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function(serverResponse, bidRequests) {
    console.log('interpretResponse');
    //console.log(serverResponse.body.Vast_xml);
    //console.log(bidRequests[0].bidId)
    const response = serverResponse.body;
    //console.log(response.Vast_xml);
    const cpm = response.Cpm;
    const width = response.Width;
    const height = response.Height;
    const creativeId = response.createiveId || '1';
    const dealId = response.dealId || '0';
    const ttl = response.ttl || 360;
    //const referrer = utils.getTopWindowUrl(); // いらない？
    //console.log("referrer: "+refferer);
    const currency = 'JPY';
    const netRevenue = true;
    const vastXml = response.Vast_xml;
    console.log("cpm: "+cpm);
    console.log("width: "+width);
    console.log("height: "+height);
    console.log("createiveId: "+creativeId);
    console.log("dealId: "+dealId);
    console.log("ttl: "+ttl);
    console.log("currency: "+currency);
    console.log("netRevenue: "+netRevenue);
    console.log("vastXml: "+vastXml);

    const bidResponse = {
      cpm: cpm,
      width: width,
      height: height,
      creativeId: creativeId,
      dealId: dealId,
      ttl: ttl,
      currency: currency,
      netRevenue: netRevenue,
      ad: '<h3>this is ad</h3>',
      //vastUrl: 'http://localhost:8080/vast.xml',
      vastXml: vastXml,
      //mediaType: VIDEO
    };
    //return bidRequests.map(bidReq => {
    //  return bidResponse.requestId = bidReq.bidId;
    //});
    bidResponse.requestId = bidRequests.bidRequest.bidId;
    console.log(bidResponse);
    return [bidResponse];
  },

  /**
   * Register the user sync pixels which should be dropped after the auction.
   *
   * @param {SyncOptions} syncOptions Which user syncs are allowed?
   * @param {ServerResponse[]} serverResponses List of server's responses.
   * @return {UserSync[]} The user syncs which should be dropped.
   */
};

registerBidder(spec);
