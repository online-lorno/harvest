/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	// components
	Pane,
	Button,
	Text,
	Link,
	Heading,
	Paragraph,
	Strong,
	Popover,
	Menu,
	Tablist,
	Tab,
	Badge,
	Pill,
	//icons
	PeopleIcon,
	AddIcon,
	DollarIcon,
	ShareIcon,
	CaretDownIcon,
	//utils
	majorScale,
	minorScale,
	Label,
	Table
} from 'evergreen-ui';

import data from './../../data.json';

// Css files
import '../../styles/fonts/fonts.css';
import '../../styles/global-overrides.css';
import './DashboardPage.css';

// Added Harvest submodules
import detectEthereumProvider from '@metamask/detect-provider';
import harvest from '../../submodules/dashboard/src/lib/index';
import {PoolManager} from '../../submodules/dashboard/src/lib/manager';
import {UnderlyingBalances} from '../../submodules/dashboard/src/lib/tokens';
import Gecko from '../../submodules/dashboard/src/lib/gecko';
import assetData from '../../submodules/dashboard/src/lib/data/deploys';

import {ethers} from 'ethers';

const {utils} = harvest;

const ETH_DECIMAL = 18;
const NUM_DECIMAL = 5;

const CURRENT_SCREENSIZE = 800;

export class DashboardPage extends Component {
	
	static propTypes = {
		reset: PropTypes.func.isRequired
	}

	state = {
		infuraId: '3bda563b54a44db595996726fab75a04',
		id: '',
		// tabs	
		selectedTabIndex: 1,
		tabs: ['Pool Performance', 'My Farms'],
		// pools
		selectedPool: null,
		pools: [{ text: 'All pools', value: '-' }].concat(data.pools.map(o => ({
			value: o.id,
			text: o.name
		}))),
		provider: undefined,
		signer: undefined,
		address: '',
		addressTruncated: '',
		manager: undefined,	
		summaries: [],
		underlyings: [],
		positions: [],
		farmPrice: 0,
		ethPrice: 0,
		totalEarnedRewards: 0,
		totalUnstakedReward: 0,
		totalStakedReward: 0,
		totalValue: 0,
		totalRewards: 0,
		usdValue: 0
	}

	componentDidMount(){
		
		// Try to connect and get balance
		try {
			this.connectMetamask();
			console.log(this.state.provider);
		} catch (e){console.log(e);}

	}

	setProvider(provider) {
		provider = new ethers.providers.Web3Provider(provider);
	
		let signer;
		try {
		  signer = provider.getSigner();
		} catch (e) {console.log(e);}
		const manager = harvest.manager.PoolManager.allPastPools(signer ? signer : provider);
	
		this.setState({provider, signer, manager});
		
		// get the user address
		const address = signer.getAddress()
		  .then((address) => this.setState({address}));

		console.log({provider, signer, manager, address});	

	  }
	
	async connectMetamask() {
		const provider =  detectEthereumProvider()
			.then((provider) => {
				window.ethereum.enable()
					.then(() => this.setProvider(provider));
			});

		console.log(provider);
		return provider;
	}
	
	
	truncateEthAddress(Address) {
		let truncatedAddress = '';

		truncatedAddress = Address.slice(0,12) + " ... ";
		truncatedAddress = truncatedAddress + Address.slice(38,42);

		return truncatedAddress;
	}

	async getTokenPrice(tokenName) {

		const tokenDetails = this.assetData.assetByName("FARM");
		const priceOracle = Gecko.coingecko();
		const tokenPrice = await priceOracle.getPrice(tokenDetails.address);

		return tokenPrice;
	}

	async getBalances() {
		const man = await PoolManager.allPastPools(this.state.provider);
		const summaries = await man.summary(this.state.address);
		const underlyings = await man.underlying(this.state.address, true);
		
		console.log(this.state.address);
		console.log(this.state.provider);
		console.log(summaries);
		
		let totalRewards = ethers.BigNumber.from(0);
		let totalValue = ethers.BigNumber.from(0);
		const positions = summaries
			.map(utils.prettyPosition)
			.filter((p) => p.earnedRewards !== '0.0' || p.stakedBalance !== '0.0');
	  
		summaries.forEach((pos) => {
		  totalRewards = totalRewards.add(pos.summary.earnedRewards);
		  totalValue = totalValue.add(pos.summary.usdValueOf);
		});
	  
		// combine all underlying positions
		let aggregateUnderlyings = new UnderlyingBalances();
	  
		underlyings.reduce((acc, next) => {
		  return acc.combine(next.underlyingBalances);
		}, aggregateUnderlyings);
	  
		aggregateUnderlyings = aggregateUnderlyings
		  .toList()
		  .filter((underlying) => !underlying.balance.isZero())
		  .map((u) => {
			  return {
			  name: u.asset.name,
			  balance: ethers.utils.formatUnits(u.balance, u.asset.decimals)};
		  });

		const output = {
		  positions,
		  totalRewards: ethers.utils.formatUnits(totalRewards, ETH_DECIMAL).toString(),
		  totalValue: totalValue.toString(),
		  underlyings: aggregateUnderlyings
		};

		console.log(output);
		let farmTokenPrice = 0;
		let ethTokenPrice = 0;
	
		const tokenDetails = assetData.assetByName("FARM");
		const priceOracle = Gecko.coingecko();

		farmTokenPrice = await priceOracle.getPrice(tokenDetails.address).then( (price) => {
			 return price.toNumber();
		});

		ethTokenPrice = await priceOracle.getPrice('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2').then( (price) => {
			return price.toNumber();
	   });

		this.setState({ 
			positions: positions,
			underlyings: aggregateUnderlyings,
			totalValue: utils.prettyMoney(totalValue),
			totalRewards: parseFloat(ethers.utils.formatUnits(totalRewards, ETH_DECIMAL)),
			farmPrice: {
				pretty: utils.prettyMoney(farmTokenPrice),
				raw: parseFloat(ethers.utils.formatUnits(farmTokenPrice, 2))
			},
			ethPrice: {
				pretty: utils.prettyMoney(ethTokenPrice),
				raw: parseFloat(ethers.utils.formatUnits(ethTokenPrice, 2))
			}
		});

	}

	actionLinkOpenHarvestFi() {
		window.open("https://harvest.finance","_blank");
	}

	render() {
		const {
			id,
			selectedTabIndex,
			pools,
			selectedPool
		} = this.state;

		let dataPools = [];
		if (!selectedPool || selectedPool.value === '-') {
			dataPools = data.pools;
		} else {
			dataPools = [data.pools.find(o => o.id === selectedPool.value)];
		}

		try{
			this.getBalances();
		} catch (e){console.log(e);}

		// Log the table

		return (
			<React.Fragment>
				{/* Dashboard Header */}
				<Pane className="header" display="flex" justifyContent="center" padding={majorScale(2)}>
					<Pane width={CURRENT_SCREENSIZE}>
						<Pane justifyContent="center" >
							<Pane display="flex" flexDirection="row" alignItems="center" justifyContent="center"  marginBottom={majorScale(3)}>								
								<Heading size={500} color="#F2C94C" marginBottom={majorScale(2)}>
									<Link href="" color="green" target="_blank." rel="noopener noreferrer">{this.state.address}</Link>
								</Heading>
							</Pane>
							<Pane display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom={majorScale(2)}>
								<Button width={200} appearance="primary" justifyContent="center" intent="success" marginRight={majorScale(2)} iconBefore={DollarIcon} onClick={this.actionLinkOpenHarvestFi.bind(this)}>Go to Harvest.finance</Button>
								<Button width={200} appearance="default" justifyContent="center" intent="none" iconBefore={DollarIcon} onClick={this.actionLinkOpenHarvestFi.bind(this)}>Exit all pools</Button>
							</Pane>
						</Pane>
						<Pane elevation={1} background="white" justifyContent="flex" >
							<Pane display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom={majorScale(2)}>	
								<Pane
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Heading size={100}>Total Position Value</Heading>
										
									</Pane>
									<Heading className="hf-number" color="#219653" size={800} width={"auto"}> {this.state.totalValue} </Heading>

								</Pane>	
							</Pane>		
							<Pane display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom={majorScale(2)}>	
								<Pane
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Heading size={100}>$FARM Price</Heading>										
									</Pane>
									
									<Heading className="hf-number" color="#219653" size={600} width={"auto"} marginBottom={minorScale(1)}> 
										{ (this.state.farmPrice.pretty ? this.state.farmPrice.pretty : 0 ) }
									</Heading>
									
									<Heading className="hf-number" size={100} width={"auto"} color="#BDBDBD">
										1 ≈ {parseFloat( ( this.state.ethPrice ? (this.state.farmPrice.raw / this.state.ethPrice.raw) : 0)).toFixed(NUM_DECIMAL)}Ξ
									</Heading>
									
								</Pane>														
								<Pane
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Heading size={100}>Current $FARM Earnings</Heading>
										
									</Pane>
									<Heading className="hf-number" color="#219653" size={600} width={"auto"} marginBottom={minorScale(1)}> {this.state.totalRewards.toFixed(NUM_DECIMAL)} </Heading>

									<Heading className="hf-number" size={100} width={"auto"} color="#BDBDBD">
										≈ ${parseFloat( ( this.state.farmPrice ? (this.state.farmPrice.raw * this.state.totalRewards) : 0)).toFixed(NUM_DECIMAL)}
									</Heading>
								</Pane>
								<Pane
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Heading size={100}>Staked $FARM</Heading>
										
									</Pane>
									<Heading className="hf-number" color="#219653" size={600} marginBottom={minorScale(1)}>
										{this.state.totalStakedReward.toFixed(NUM_DECIMAL)}
									</Heading>

									<Heading className="hf-number" size={100} width={"auto"} color="#BDBDBD">
										≈ ${parseFloat( ( this.state.ethPrice ? (this.state.farmPrice.raw * this.state.totalStakedReward) : 0)).toFixed(NUM_DECIMAL)}
									</Heading>								
								</Pane>
								<Pane	
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Heading size={100}>Idle $FARM</Heading>
										
									</Pane>
									<Heading className="hf-number" color="#219653" size={600} marginBottom={minorScale(1)}>
										{this.state.totalUnstakedReward.toFixed(NUM_DECIMAL)}
									</Heading>

									<Heading className="hf-number" size={100} width={"auto"} color="#BDBDBD">
										≈ ${parseFloat( ( this.state.ethPrice ? (this.state.farmPrice.raw * this.state.totalUnstakedReward) : 0)).toFixed(NUM_DECIMAL)}
									</Heading>				
								</Pane>
							</Pane>
							
							{/* Dashboard Content */}
							<Pane display="flex" justifyContent="center" paddingY={majorScale(2)}>

								{/* Pools table */}
								<Pane marginLeft={majorScale(5)} marginRight={majorScale(5)} marginBottom={majorScale(5)} width={CURRENT_SCREENSIZE}>

									{/* Table label */}
									<Pane display="flex" flexDirection="row" >
										<Pane flex={0.5} justifyContent="center">
											<Heading size={400} marginTop={0} textTransform="uppercase">Pools participated</Heading>
											<Text size={300} color="#BDBDBD">These are the pools that you have staked in.</Text>
										</Pane>
										<Pane flex={0.5} justifyContent="center">
											<Pane display="flex" justifyContent="flex-end">
												<Button appearance="primary" intent="success">Claim all rewards</Button>
											</Pane>
										</Pane>
									</Pane>

									{/* Pool List */}
									<Pane>
										<Table marginTop={majorScale(3)}>
											<Table.Head>
												<Table.TextHeaderCell>
													Pool
												</Table.TextHeaderCell>
												<Table.TextHeaderCell>
													Earned
												</Table.TextHeaderCell>
												<Table.TextHeaderCell>
													Unstaked
												</Table.TextHeaderCell>
												<Table.TextHeaderCell>
													Your Share
												</Table.TextHeaderCell>
												<Table.TextHeaderCell>
													Pool % Share
												</Table.TextHeaderCell>																						
											</Table.Head>
											<Table.Body height={"auto"}>	

												{this.state.positions.map( pos =>
													<Table.Row key={`pos-${pos.name}`}>
														<Table.TextCell>
															<Paragraph size={300}>{pos.name}</Paragraph>
															<Heading size={100} color="#BDBDBD">Deposit {pos.name}</Heading>
														</Table.TextCell>
														<Table.TextCell isNumber>
															<Paragraph size={300}>{parseFloat(pos.earnedRewards).toFixed(8)}</Paragraph>
															<Heading size={100} color="#BDBDBD">≈ ${(pos.earnedRewards*this.state.farmPrice.raw).toFixed(NUM_DECIMAL)}</Heading>
														</Table.TextCell>
														<Table.TextCell isNumber>
															<Paragraph size={300}>{pos.unstakedBalance}</Paragraph>
														</Table.TextCell>
														<Table.TextCell isNumber>		
															<Paragraph size={300}>{pos.usdValueOf}</Paragraph>
														</Table.TextCell>
														<Table.TextCell isNumber>
															<Paragraph size={300}>{pos.percentOfPool}</Paragraph>
														</Table.TextCell>
													</Table.Row>
												)}

											</Table.Body>
										</Table>
									</Pane>
									
								</Pane>

							</Pane>
						</Pane>
					</Pane>
				</Pane>
				<Pane display="flex" flexDirection="column" alignItems="center" justifyContent="center">
					<Heading marginTop={majorScale(4)} size={500}>Made for the Farmers 🚜 with 💖</Heading>
					<Paragraph marginTop={majorScale(1)} size={300}>
						<Strong color="green">0xA4050d47E3435Dc298462d009426C040668F4297</Strong>
					</Paragraph>
				</Pane>

			</React.Fragment>
		);
	}
}

export default DashboardPage;
