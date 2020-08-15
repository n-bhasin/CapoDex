//SPDX-License-Identifier:unlicensed
pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

///@author Bhasin Neeraj
///@title Dex for ERC20 tokens
contract Dex {
    using SafeMath for uint256;
    //creating state of buy and sell for order
    enum Side {BUY, SELL}
    //event for NewTrade
    event NewTrade(
        uint256 tradeId,
        bytes32 indexed ticker,
        address indexed trader1,
        address indexed trader2,
        uint256 side,
        uint256 amount,
        uint256 price,
        uint256 date
    );

    /**
     * struct for registering Token
     * struct for collection orders
     */
    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }

    // struct Order {
    //     uint256 id;
    //     Side side;
    //     uint256 amount;
    //     uint256 filled;
    //     uint256 price;
    //     uint256 date;
    //     address trader;
    //     bytes32 ticker;
    // }

    /**@dev
     * mapping ticker => Token struct
     *tracking the amount/owners of tokens
     * ticker=> buy/sell => Order-all order values
     * storing all tickers in tokenList
     * storing all order ids in orderList
     * storing all trader ids in traderList
     * admin address
     * declaring cosntant variable for DAI ticker
     */
    mapping(bytes32 => Token) tokens;
    mapping(address => mapping(bytes32 => uint256)) public traderBalances;
    // mapping(bytes32 => mapping(uint256 => Order[])) public orderBook;
    bytes32[] public tokenList;
    //uint256[] public orderList;
    uint256[] public traderList;
    //uint256 nextOrderId;
    uint256 nextTradeId;
    address admin;
    bytes32 constant DAI = bytes32("DAI");

    constructor() public {
        admin = msg.sender;
    }

    function tickers() public view returns (bytes32[] memory) {
        return tokenList;
    }

    function getTokenList() public view returns (bytes32[] memory) {
        return tokenList;
    }

    function extractTokens(bytes32 _ticker)
        public
        view
        returns (bytes32, address)
    {
        return (tokens[_ticker].ticker, tokens[_ticker].tokenAddress);
    }

    function getTokens() external view returns (Token[] memory) {
        Token[] memory _tokens = new Token[](tokenList.length);
        for (uint256 i = 0; i < tokenList.length; i++) {
            _tokens[i] = Token(
                tokens[tokenList[i]].ticker,
                tokens[tokenList[i]].tokenAddress
            );
        }
        return _tokens;
        //return (tokens[_ticker].ticker, tokens[_ticker].tokenAddress);
    }

    //adding tokens to mappings- registering the tokens
    function addToken(bytes32 _ticker, address _tokenAddress)
        external
        onlyAdmin()
    {
        tokens[_ticker] = Token(_ticker, _tokenAddress);
        tokenList.push(_ticker);
    }

    // function getOrders(bytes32 _ticker, Side _side)
    //     public
    //     view
    //     returns (Order[] memory)
    // {
    //     return orderBook[_ticker][uint256(_side)];
    // }

    /**-----START: Wallet------**/
    //defining a wallet for deposit and withdraw of tokens from smart contract
    function deposit(uint256 _amount, bytes32 _ticker)
        external
        tokenExist(_ticker)
    {
        //casting token addr inot IERC20 to call the transferFrom function
        IERC20(tokens[_ticker].tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        traderBalances[msg.sender][_ticker] = traderBalances[msg
            .sender][_ticker]
            .add(_amount);
    }

    function withdrawal(uint256 _amount, bytes32 _ticker)
        external
        tokenExist(_ticker)
    {
        require(
            traderBalances[msg.sender][_ticker] >= _amount,
            "Dex: Insufficient Balances"
        );
        traderBalances[msg.sender][_ticker] = traderBalances[msg
            .sender][_ticker]
            .sub(_amount);
        IERC20(tokens[_ticker].tokenAddress).transfer(msg.sender, _amount);
    }

    /**-----END: Wallet------**/

    /**-----START: Market orders settlement------**/
    function createMarketOrder(
        address _trader,
        uint256 _amount,
        bytes32 _ticker,
        uint256 _side,
        uint256 _filled,
        uint256 _price
    ) public tokenExist(_ticker) tokenIsNotDai(_ticker) {
        bytes32 hash = keccak256(
            abi.encode(_trader, _amount, _ticker, _side, _price)
        );
        emit NewTrade(
            nextTradeId,
            _ticker,
            _trader,
            msg.sender,
            _side,
            _filled,
            _price,
            block.timestamp
        );
        if (_side == 0) {
            traderBalances[msg.sender][_ticker] = traderBalances[msg
                .sender][_ticker]
                .sub(_filled);
            traderBalances[msg.sender][DAI] = traderBalances[msg.sender][DAI]
                .add(_filled.mul(_price));
            traderBalances[_trader][_ticker] = traderBalances[_trader][_ticker]
                .add(_filled);
            traderBalances[_trader][DAI] = traderBalances[_trader][DAI].sub(
                _filled.mul(_price)
            );
        }
        if (_side == 1) {
            require(
                traderBalances[msg.sender][DAI] >= _filled.mul(_price),
                "Dex: Insufficient DAI Balance"
            );

            traderBalances[msg.sender][_ticker] = traderBalances[msg
                .sender][_ticker]
                .add(_filled);
            traderBalances[msg.sender][DAI] = traderBalances[msg.sender][DAI]
                .sub(_filled.mul(_price));
            traderBalances[_trader][_ticker] = traderBalances[_trader][_ticker]
                .sub(_filled);
            traderBalances[_trader][DAI] = traderBalances[_trader][DAI].add(
                _filled.mul(_price)
            );
        }
        nextTradeId = nextTradeId.add(1);
    }

    /**-----END: MARKET orders------**/
    /**-----START: MARKET orders------**/
    // function createMarketOrder(
    //     bytes32 _ticker,
    //     uint256 _amount,
    //     Side _side
    // ) external tokenExist(_ticker) tokenIsNotDai(_ticker) {
    //     if (_side == Side.SELL) {
    //         require(
    //             traderBalances[msg.sender][_ticker] >= _amount,
    //             "Dex: Insufficent Balance"
    //         );
    //     }
    //     //taking the pointer of other side of order: if the marketOrder is of BUY it will point to SELL
    //     Order[] storage orders = orderBook[_ticker][uint256(
    //         _side == Side.BUY ? Side.SELL : Side.BUY
    //     )];
    //     uint256 i; //initial value of i will be 0
    //     uint256 remaining = _amount;
    //     while (i < orders.length && remaining > 0) {
    //         uint256 available = orders[i].amount.sub(orders[i].filled);
    //         uint256 matched = (remaining > available) ? available : remaining;
    //         remaining = remaining.sub(matched);
    //         orders[i].filled = orders[i].filled.add(matched);
    //         emit NewTrade(
    //             nextTradeId,
    //             orders[i].id,
    //             matched,
    //             orders[i].price,
    //             now,
    //             orders[i].trader,
    //             msg.sender,
    //             _ticker
    //         );

    //         if (_side == Side.SELL) {
    //             traderBalances[msg.sender][_ticker] = traderBalances[msg
    //                 .sender][_ticker]
    //                 .sub(matched);
    //             traderBalances[msg.sender][DAI] = traderBalances[msg
    //                 .sender][DAI]
    //                 .add(matched.mul(orders[i].price));
    //             traderBalances[orders[i]
    //                 .trader][_ticker] = traderBalances[orders[i]
    //                 .trader][_ticker]
    //                 .add(matched);
    //             traderBalances[orders[i].trader][DAI] = traderBalances[orders[i]
    //                 .trader][DAI]
    //                 .sub(matched.mul(orders[i].price));
    //         }
    //         if (_side == Side.BUY) {
    //             require(
    //                 traderBalances[msg.sender][DAI] >=
    //                     matched.mul(orders[i].price),
    //                 "Dex: Insufficient DAI Balance"
    //             );

    //             traderBalances[msg.sender][_ticker] = traderBalances[msg
    //                 .sender][_ticker]
    //                 .add(matched);
    //             traderBalances[msg.sender][DAI] = traderBalances[msg
    //                 .sender][DAI]
    //                 .sub(matched.mul(orders[i].price));
    //             traderBalances[orders[i]
    //                 .trader][_ticker] = traderBalances[orders[i]
    //                 .trader][_ticker]
    //                 .sub(matched);
    //             traderBalances[orders[i].trader][DAI] = traderBalances[orders[i]
    //                 .trader][DAI]
    //                 .add(matched.mul(orders[i].price));
    //         }
    //         nextTradeId = nextTradeId.add(1);
    //         i = i.add(1);
    //     }
    //     i = 0;
    //     while (i < orders.length && orders[i].filled == orders[i].amount) {
    //         for (uint256 j = i; j < orders.length - 1; j++) {
    //             orders[j] = orders[j + 1];
    //         }
    //         orders.pop();
    //         i = i.add(1);
    //     }
    // }

    /**-----END: MARKET orders------**/
    /**
     * @dev Modifiers
     */
    //declaring all modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Dex: This is not authorised address");
        _;
    }
    modifier tokenExist(bytes32 _ticker) {
        require(
            tokens[_ticker].tokenAddress != address(0),
            "Dex: Token Address doesn't exist"
        );
        _;
    }
    modifier tokenIsNotDai(bytes32 _ticker) {
        require(_ticker != DAI, "Dex: Cannot trade DAI token");
        _;
    }
}
