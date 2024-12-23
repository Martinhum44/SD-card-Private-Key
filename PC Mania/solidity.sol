// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
bytes4 constant ERC721 = 0x80ac58cd; 
bytes4 constant ERC165 = 0x01ffc9a7; 

interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC721 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function tokenURI(uint id) external view returns(string memory);
    function getApproved(uint256 tokenId) external view returns (address operator);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
}

interface IERC20 {
  function name() external view returns (string memory);
  function symbol() external view returns (string memory);
  function decimals() external pure returns (uint8);
  function totalSupply() external view returns (uint256);
  function balanceOf(address account) external view returns (uint256);
  function transfer(address recipient, uint256 amount) external returns (bool success);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract ERC20 is IERC20{
    mapping(address => uint) balances;
    address immutable public manager;
    string public nmee;
    string public symb;
    uint public totalsupply;

    modifier onlyManager{
        require(manager == msg.sender);
        _;
    }

    constructor(string memory _name, string memory _symbol){
        manager = msg.sender;
        nmee = _name;
        symb = _symbol;
    }

    function mint(address who, uint amount) onlyManager public returns(address, uint) {
        balances[who] += amount;
        totalsupply += amount;
        return (who,amount);
    }

    function burn(address who, uint amount) onlyManager public returns(address, uint) {
        balances[who] -= amount;
        totalsupply -= amount;
        return (who,amount);
    }

    function name() external view returns(string memory){
        return nmee;
    }

    function symbol() external view returns(string memory){
        return symb;
    }

    function decimals() external pure virtual returns(uint8){
        return 18;
    }

    function totalSupply() external view returns(uint){
        return totalsupply;
    }

    function transfer(address recipient, uint amount) external returns(bool){
        balances[recipient] += amount;
        balances[msg.sender] -= amount;
        emit Transfer(msg.sender,recipient,amount);
        return true;
    }

    function balanceOf(address account) public view returns(uint){
        return balances[account];
    }
}

contract MineCoin is ERC20("Mine Coin", "MICO"){
    address conty;
    nftTime public adminContract;

    constructor(address who){
        adminContract = nftTime(who);
    }

    function mintToken(address who, uint amount) public {
        require(msg.sender == address(adminContract));
        super.mint(who, amount);
    }
}

contract WIRE is ERC20("Crafting Wire", "WIRE"){
    address conty;
    nftTime public adminContract;

    constructor(address who){
        adminContract = nftTime(who);
    }

    modifier onlyPermited{
        require(msg.sender==address(adminContract), "user not permited");
        _;
    }

    modifier onlyWire(uint amount, address whos){
        require(super.balanceOf(whos) > amount, "not enough WIRE");
        _;
    }

    function craft(address who) public onlyWire(5, who) {
        require(msg.sender == address(conty), "only superior may call!!!");
        super.burn(who, 5);
        adminContract.mintNFTExternal(true, who, 0);
    }

    function decimals() external pure override returns(uint8){
        return 1;
    }

    function mintToken(address who) public {
        require(msg.sender == address(adminContract));
        super.mint(who, 1);
    }
}

contract nftTime is IERC721, IERC165 {
    bool deployed = false;
    WIRE public wire;
    MineCoin public mine; 

    uint rn;
    uint listNumber;
    uint nftCount;
    address owner;

    event Open(address indexed who, uint random, uint nftId);
    event Unstake(address indexed who, uint random, uint nftId);
    event Broken(address indexed who, uint nftId);

    enum nftStati {
        pcBox,
        potatoPc,
        coolPc,
        GoldPc
    }

    struct nftI {
        bool listed;
        nftStati NS;
        uint level;
        uint xp;
        uint id;
        bool staked;
        uint time4stake;
        address owner;
        string URI;
        int condition;
    }

    struct list {
        nftI nftBase;
        uint price;
        bool bought;
        address payable lister;
        uint nftId;
        uint listId;        
    }

    mapping(uint => nftI) nfs;
    mapping(uint => list) public listee; 
    mapping(uint => address) approvals;
    mapping(address => mapping(address => bool)) approvalsForAll;
    mapping(uint => address) stakedBy;

    function supportsInterface(bytes4 interfaceId) external pure returns (bool){
        return (interfaceId == ERC721 || interfaceId == ERC165);
    }

    function _safeMint(address to, uint id) internal {
        nfs[id] = nftI({
            listed: false,
            NS: nftStati.pcBox,
            level: 0,
            xp: 0,
            condition: 0,
            id: id,
            staked: false,
            time4stake: 0,
            owner: to,
            URI: "NULL"
        });
    }

    function name() external pure returns (string memory) {
        return "Personal Computers";
    }

    function countReturn() external view returns (uint, uint){
        return (nftCount, listNumber);
    }

    function symbol() external pure returns (string memory) {
        return "PC";
    }

    function mintNFT(bool transToSomeones, address thenWhos, uint typess) internal {
        _safeMint(address(this), nftCount);
        runofthemill(transToSomeones, thenWhos, typess);
        emit Approval(address(0), address(this), nftCount);
    }

    function mintNFTExternal(bool transToSomeones, address thenWhos, uint typess) external {
        require(msg.sender == address(wire));
        mintNFT(transToSomeones, thenWhos, typess);
    }

    function transferFrom(address from, address to, uint nftID) public {
        require (msg.sender == from || msg.sender == address(this) || approvals[nftID] == to || approvalsForAll[ownerOf(nftID)][from], "you must be 'from' or approved");
        nfs[nftID].owner = to;
        approvals[nftID] = address(0);
        emit Transfer(from, to, nftID);
    }

    function safeTransferFrom(address from, address to, uint nftID) public {
        require (msg.sender == from || msg.sender == address(this) || approvals[nftID] == to, "you must be 'from' or approved");
        require (to != address(0), "transfer to the 0 address not allowed");
        nfs[nftID].owner = to;
        approvals[nftID] = address(0);
        emit Transfer(from, to, nftID);
    }

    function getApproved(uint256 tokenId) external view returns (address){
        return approvals[tokenId];
    }

    function approve(address to, uint id) public {
        require(msg.sender == ownerOf(id), "noooo");
        approvals[id] = to;
        emit Approval(msg.sender, to, id);
    }

    function isApprovedForAll(address _owner, address operator) external view returns (bool){
        return approvalsForAll[_owner][operator];
    }

    function setApprovalForAll(address operator, bool approved) external{
        approvalsForAll[msg.sender][operator] = approved;
    }

    function contractApprove(address to, uint id) internal {
        require(address(this) == ownerOf(id));
        approvals[id] = to;
        emit Approval(msg.sender, to, id);
    }

    function _setTokenURI(uint nftID, string memory _URI) internal {
        nfs[nftID].URI = _URI;
    }

    function tokenURI(uint id) external view returns(string memory){
        return nfs[id].URI;
    }

    function balanceOf(address _owner) external view returns(uint){
        uint count = 0;
        for(uint i = 0; i <= nftCount; i++){
            if(ownerOf(i) == _owner){
                count++;
            }
        }
        return count;
    }

    function runofthemill(bool transToSomeone, address thenWho, uint types) internal{
        if (transToSomeone){
            transferFrom(msg.sender, thenWho, nftCount);
        }
        if (types == 0){ 
            nfs[nftCount].NS = nftStati.pcBox;
            nfs[nftCount].id = nftCount;
            nfs[nftCount].condition = 1000;
            _setTokenURI(nftCount, "ipfs://bafkreibu3wr27qrwu42jvxe2qbhbxznxup4tc7oszp5d2btwgsyu2akmp4");
        }
        if (types == 1){
            nfs[nftCount].NS = nftStati.potatoPc;
            nfs[nftCount].id = nftCount;
            nfs[nftCount].condition = 100;
            _setTokenURI(nftCount, "ipfs://bafkreihfwu3vhs34gz6bfxh7spoazwjrk7wnpsuvs23id6tpbfexqbacd4");
        }
        if (types == 2){
            nfs[nftCount].NS = nftStati.coolPc;
            nfs[nftCount].id = nftCount;
            nfs[nftCount].condition = 125;
            _setTokenURI(nftCount, "ipfs://bafkreidjnya5xog3fww2shsals5byp422ntprfxlgpebfajpn6argzxlge");
        }
        if (types == 3){
            nfs[nftCount].NS = nftStati.GoldPc;
            nfs[nftCount].id = nftCount;
            nfs[nftCount].condition = 150;
            _setTokenURI(nftCount, "ipfs://bafkreicibvdeh74lnz7f4igwksnqx3655knmqaplidqflg5pevxgkgqedy");
        }
        nftCount++;
    }

    function regMintNFT(bool transToSomeones, address thenWhos, uint typess) external {
        require(msg.sender == address(wire));
        _safeMint(address(wire), nftCount);
        runofthemill(transToSomeones, thenWhos, typess);
    }

    constructor() payable{
        owner = msg.sender;
    
        for (uint i = 0; i < 30; i++) {
            uint id = nftCount;
            mintNFT(false, address(0), 0);
            listContNFT(id, 10**12);
        }
        wire = new WIRE(address(this));
        mine = new MineCoin(address(this));
        deployed = true;
    }

    modifier onlyWire(uint amount){
        require(amount <= wire.balanceOf(msg.sender));
        _;
    }

    function listContNFT(uint id, uint price) internal {
        listee[listNumber].nftBase = nfs[id];
        listee[listNumber].bought = false;
        listee[listNumber].lister = payable(address(this));
        listee[listNumber].price = price;
        listee[listNumber].nftId = nfs[id].id;
        listee[listNumber].listId = listNumber;
        nfs[id].listed = true;
        listNumber++;
    }

    function ownerOf(uint id) public view returns(address){
        return nfs[id].owner;
    }

    function listNFT(uint id, uint price) external onlyNFTOwner(id){
        listee[listNumber].nftBase = nfs[id];
        listee[listNumber].bought = false;
        listee[listNumber].lister = payable(msg.sender);
        listee[listNumber].price = price;
        listee[listNumber].nftId = nfs[id].id;
        listee[listNumber].listId = listNumber;
        nfs[id].listed = true;
        listNumber++;
        if (msg.sender != address(this)) {
            transferFrom(msg.sender, address(this), id);
        }
    }

    function UnlistNFT(uint id) external{
        require(listee[listNumber].lister == msg.sender, "U NEED TO BE THE OWNER BASTUD");
        nfs[id].listed = false;
        transferFrom(address(this), listee[listNumber].lister, id);
    }

    function _burn(uint id) internal {
        require(ownerOf(id) == msg.sender, " you need to be the owner of the nft");
        nfs[id].owner = address(0);
    }

    function viewList(uint idOfList) public view returns (list memory) {
        return (listee[idOfList]);
    }

    function viewNFT(uint id) external view returns (nftI memory){
        return(nfs[id]);
    }

    function buyNFT(uint listId) external payable {    
        require(listee[listId].bought == false, "listing already bought");
        require(msg.sender.balance >= listee[listId].price, "balance needs to be greater than the price of the NFT");
        require(msg.value == listee[listId].price, "send more moneyyyyy!!!!!!!!!!!!!!!!!!!");
        require(nfs[listee[listId].nftId].listed, "not listed.");
        address payable lister = listee[listId].lister;
        contractApprove(msg.sender, listee[listId].nftId);
        transferFrom(address(this), msg.sender, listee[listId].nftId);
        nfs[listee[listId].nftId].listed = false;
        listee[listId].bought = true;
        if(lister != address(this)){
            payable(lister).transfer(listee[listId].price);
        } 
    }

    function openNFT(uint id) external onlyNFTOwner(id) returns(uint){
        require(nfs[id].NS == nftStati.pcBox, "nft not pc box");
        uint _randomNumber = randomNumber(0, 1000);
        _burn(id);
        rn = _randomNumber;
        if(_randomNumber == 1000){
            mintNFT(true, msg.sender, 3);
        }
        if(_randomNumber <= 999  && _randomNumber >= 800){
            mintNFT(true, msg.sender, 2);
        }
        if(_randomNumber <= 799){
            mintNFT(true, msg.sender, 1);
        }
        emit Open(msg.sender, id,_randomNumber);
        return(_randomNumber);
    }

    function viewOwner() external view returns(address){
        return(owner);
    }

    function randomNumber(uint start, uint finish) public view returns(uint){
        bytes32 hash = keccak256(abi.encodePacked(block.timestamp, msg.sender, block.number ));
        uint fin = uint(hash) % (finish - start);
        fin += start;
        return fin;
    }

    modifier onlyNFTOwner(uint nftId){
        require(ownerOf(nftId) == msg.sender, "U NEED TO BE THE OWNER BASTUD");
        _;
    }

    function stakeNFT(uint id) external onlyNFTOwner(id){ 
        require(nfs[id].staked == false, "this bad boy has already been staked. BRUH! F IN THE CHAT!!!");
        require(nfs[id].NS != nftStati.pcBox, "open the nft big L");
        require(nfs[id].condition >= 0, "your PC broke hahahahaha. Repair it!");
        transferFrom(msg.sender,address(this),id);
        nfs[id].time4stake = block.timestamp;
        nfs[id].staked = true;
        stakedBy[id] = msg.sender;
    }

    function unstakeNFT(uint id) external{
        nftI storage NFT = nfs[id];
        require(stakedBy[id] == msg.sender, "You must be the nft staker. DUH!!!");
        require(NFT.staked, "NFT hasn't been staked. Unstaking without staking. REALLY!!! LMFAO!");
        require(block.timestamp > NFT.time4stake+3600, "WAIT IMPATIENT BITCH");
        NFT.time4stake = 0;
        contractApprove(msg.sender, id);
        transferFrom(address(this),msg.sender,id);
        NFT.staked = false;
        uint rand = randomNumber(1,1000);
        if(NFT.NS == nftStati.potatoPc){
            mine.mintToken(msg.sender, randomNumber(1*10**18, 5*10**18));
            if (rand < 100){
                wire.mintToken(msg.sender);
            }
        }  
        else if(NFT.NS == nftStati.coolPc){
            mine.mintToken(msg.sender, randomNumber(3*10**18, 10*10**18));
            if (rand < 250){
                wire.mintToken(msg.sender);
            }
        }
        else if(NFT.NS == nftStati.GoldPc){
            mine.mintToken(msg.sender, randomNumber(30*10**18, 100*10**18));
            if (rand < 900){
                wire.mintToken(msg.sender);
            }
        }
        int conditiony = int(NFT.condition) - int(randomNumber(5, 10));
        if(NFT.condition <= 0){
            emit Broken(msg.sender, id);
        } 
        NFT.condition = conditiony;
        emit Unstake(msg.sender, id, rand);
    }

    function craft() external {
        wire.craft(msg.sender);
    }

    function repairNFT(uint id) external onlyNFTOwner(id) {
        require(nfs[id].NS != nftStati.pcBox, "open the nft big L");
        nftI storage NFT = nfs[id];
        uint costMultiplier = ((NFT.condition) <= 0 ? 2 : 1);
        if(NFT.NS == nftStati.potatoPc){
            require(wire.balanceOf(msg.sender) >= 1*costMultiplier && mine.balanceOf(msg.sender) > 25*10**18*costMultiplier, "not enough tokens");   
            NFT.condition = int(100);
            wire.burn(msg.sender, 1*costMultiplier);
            mine.burn(msg.sender, 25*10**18*costMultiplier);
        } else if (NFT.NS == nftStati.coolPc){
            require(wire.balanceOf(msg.sender) >= 1*costMultiplier && mine.balanceOf(msg.sender) > 50*10**18*costMultiplier, "not enough tokens");
            NFT.condition = int(125);
            wire.burn(msg.sender, 1*costMultiplier);
            mine.burn(msg.sender, 50*10**18*costMultiplier);
        } else if (NFT.NS == nftStati.coolPc){
            require(wire.balanceOf(msg.sender) >= 3*costMultiplier && mine.balanceOf(msg.sender) > 150*10**18*costMultiplier, "not enough tokens");
            NFT.condition = int(150);
            wire.burn(msg.sender, 1*costMultiplier);
            mine.burn(msg.sender, 150*10**18*costMultiplier);
        }
    }

    function upgradeNFT(uint id) external onlyNFTOwner(id){
        nftI storage NFT = nfs[id];
        require(NFT.NS != nftStati.pcBox, "PC boxes can't be upgraded. It's like upgrading a cardboard box - you can't. How old are you? five? ");
        require(NFT.NS != nftStati.GoldPc, "Gold PCs can't be upgraded. It's like upgrading an Alpha. It's the highest rank. How old are you? five?");
        uint amount;
        nftStati newState;
        string memory newUri;
        if(NFT.NS == nftStati.potatoPc){
            amount = 100;
            newState = nftStati.coolPc;
            newUri = "ipfs://bafkreidjnya5xog3fww2shsals5byp422ntprfxlgpebfajpn6argzxlge";
        } else if(NFT.NS == nftStati.coolPc){
            amount = 1000;
            newState = nftStati.GoldPc;
            newUri = "ipfs://bafkreicibvdeh74lnz7f4igwksnqx3655knmqaplidqflg5pevxgkgqedy";
        }
        require(mine.balanceOf(msg.sender) > amount*10**18, "What a poor loser! You don't have enough MineCoin to upgrade your PC!");
        NFT.NS = newState;
        _setTokenURI(id, newUri);
        mine.burn(msg.sender, amount);
    }

    function blocktimestamp() external view returns(uint){
        return block.timestamp;
    }
}