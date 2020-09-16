/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	// components
	Pane,
	Button,
	Text,
	Heading,
	Paragraph,
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
import ImageChart from './../../images/chart.png';
import GeneralHelper from './../../helpers/general';

// Css files
import '../../styles/fonts/fonts.css';
import '../../styles/global-overrides.css';
import './DashboardPage.css';

// Added Harvest submodules
import detectEthereumProvider from '@metamask/detect-provider';
import harvest from '../../submodules/dashboard/src/lib/index';
import {PoolManager} from '../../submodules/dashboard/src/lib/manager';
import {UnderlyingBalances} from '../../submodules/dashboard/src/lib/tokens';
import Provider from 'react-redux/lib/components/Provider';


const {ethers, utils} = harvest;

const ETH_DECIMAL = 18;
const NUM_DECIMAL = 5;

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
		manager: undefined,	
		summaries: [],
		underlyings: [],
		positions: [],
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

		this.setState({ 
			positions: positions,
			underlyings: aggregateUnderlyings,
			totalValue: utils.prettyMoney(totalValue),
			totalRewards: parseFloat(ethers.utils.formatUnits(totalRewards, ETH_DECIMAL))
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

		this.getBalances();
		// Log the table

		return (
			<React.Fragment>
				{/* Navigation */}
				{/* <Pane display="flex" justifyContent="center" background="tint2" padding={majorScale(2)}>
					<Pane width={1200} display="flex" justifyContent="flex-end">
						<Popover
							position="bottom-right"
							content={
								<Menu>
									<Menu.Group>
										<Menu.Item icon={PeopleIcon}>{GeneralHelper.ellipseId(id)}</Menu.Item>
										<Menu.Item icon={PeopleIcon}>{GeneralHelper.ellipseId(id)}</Menu.Item>
									</Menu.Group>
									<Menu.Divider />
									<Menu.Group>
										<Menu.Item icon={AddIcon} intent="success">Add an account</Menu.Item>
									</Menu.Group>
								</Menu>
							}
						>
							<Button iconAfter={CaretDownIcon}>{GeneralHelper.ellipseId(id)}</Button>
						</Popover>
					</Pane>
				</Pane> */}

				{/* Dashboard Header */}
				<Pane className="header" display="flex" justifyContent="center" padding={majorScale(2)}>
					<Pane width={1200} display="flex">
						<Pane flex={0.4}>
							<Heading size={800} color="#F2C94C" marginBottom={majorScale(2)}>YieldFarm.io</Heading>
							<Pane display="flex" marginBottom={majorScale(3)}>
								<Pane flex={0.6}>
									<Text color="#E0E0E0">{this.state.address}</Text>
									{/* <Button appearance="primary" intent="success" iconBefore={DollarIcon} onClick={this.connectMetamask.bind(this)}>Connect Wallet</Button> */}
								</Pane>
							</Pane>
							<Button appearance="primary" intent="success" iconBefore={DollarIcon} onClick={this.actionLinkOpenHarvestFi.bind(this)}>Go to Harvest.finance</Button>
						</Pane>
						<Pane flex={0.6}>
							<Pane display="flex" justifyContent="flex-end" marginBottom={majorScale(2)}>
								<Pane
									elevation={1}
									background="white"
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									marginLeft={majorScale(2)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Text size={500}>Total Position</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
									<Heading className="hf-number" size={900} width={"auto"}> {this.state.totalValue} </Heading>

								</Pane>		
								<Pane
									elevation={1}
									background="white"
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									marginLeft={majorScale(2)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Text size={500}>$FARM Price</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
									<Heading className="hf-number" size={900} width={"auto"}> {this.state.totalValue} </Heading>

								</Pane>														
								<Pane
									elevation={1}
									background="white"
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									marginLeft={majorScale(2)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Text size={500}>Total Earned $FARM</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
									<Heading className="hf-number" size={900} width={"auto"}> {this.state.totalEarnedRewards} </Heading>

								</Pane>
								<Pane
									elevation={1}
									background="white"
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									marginLeft={majorScale(2)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Text size={500}>Staked $FARM</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
									<Heading className="hf-number" size={900} marginBottom={majorScale(1)}>{this.state.totalStakedReward}</Heading>
								</Pane>
								<Pane
									elevation={1}
									background="white"
									display="flex"
									alignItems="center"
									flexDirection="column"
									paddingX={majorScale(1)}
									paddingTop={majorScale(3)}
									paddingBottom={majorScale(1)}
									marginLeft={majorScale(2)}
									minWidth={200}
								>
									<Pane marginBottom={majorScale(1)}>
										<Text size={500}>Idle $FARM</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
									<Heading className="hf-number" size={900} marginBottom={majorScale(1)}>{this.state.totalUnstakedReward.toFixed(NUM_DECIMAL)}</Heading>

								</Pane>
							</Pane>
							<Pane display="flex" justifyContent="flex-end">
								<Button appearance="primary" intent="success">Stake all 🚜 to Profit Share</Button>
							</Pane>
						</Pane>
					</Pane>
				</Pane>

				{/* Dashboard Content */}
				<Pane display="flex" justifyContent="center" paddingY={majorScale(2)}>
					<Pane width={1200}>
						<Pane display="flex" marginTop={majorScale(6)}>
							{/* Left Content */}
							{/* <Pane flex={0.3}>
								<Heading size={600} color="#1D8248" marginBottom={minorScale(3)}>🚜 Farms</Heading>
								<Paragraph size={300} color="muted">Deposit stablecoins, LP tokens or FARM to learn FARM</Paragraph>

								<Paragraph marginY={majorScale(3)} textTransform="uppercase">Your overall farming stats</Paragraph>
								<Pane marginBottom={majorScale(6)}>
									
									<Pane marginBottom={majorScale(2)}>									
										<Paragraph>Unstaked Farm</Paragraph>
										<Label className="hf-number xl" size={600} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>1.5145</Label>
									</Pane>
									
									<Pane marginBottom={majorScale(2)}>	
										<Paragraph>$FARM earned</Paragraph>
										<Label className="hf-number xl" size={600} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>
											{this.state.totalRewards.toFixed(NUM_DECIMAL)}
										</Label>
									</Pane>
									
								</Pane>
								{/* 
								<Pane display="flex">
									<Paragraph marginBottom={majorScale(3)} marginRight={majorScale(1)} textTransform="uppercase"	>Current farming rate</Paragraph>
									<Popover
										position="bottom-right"
										content={
											<Menu>
												<Menu.Group>
													{pools.map(o => (
														<Menu.Item key={`pool-${o.value}`} onSelect={() => this.setState({ selectedPool: o })}>
															{o.text}
														</Menu.Item>
													))}
												</Menu.Group>
											</Menu>
										}
									>
										<Button appearance="minimal" iconAfter={CaretDownIcon} height={24}>
											{!selectedPool ? 'All pools' : selectedPool.text}
										</Button>
									</Popover>
								</Pane>
								<Pane display="flex" >
									<Pane flex={0.6}>
										<Text>Hourly</Text>
									</Pane>
									<Pane flex={0.4}>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>0.52450</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>%</Text>
												</Pane>
											</Pane>
										</Pane>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>0.01145</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>in $FARM</Text>
												</Pane>
											</Pane>
										</Pane>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>1.93455</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>in $USD</Text>
												</Pane>
											</Pane>
										</Pane>
									</Pane>
								</Pane>
								<hr color="#F2F2F2" />
								<Pane display="flex" >
									<Pane flex={0.6}>
										<Text>Daily</Text>
									</Pane>
									<Pane flex={0.4}>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>4.52450</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>%</Text>
												</Pane>
											</Pane>
										</Pane>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>0.42445</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>in $FARM</Text>
												</Pane>
											</Pane>
										</Pane>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>46.42851</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>in $USD</Text>
												</Pane>
											</Pane>
										</Pane>
									</Pane>
								</Pane>
								<hr color="#F2F2F2" />
								<Pane display="flex" >
									<Pane flex={0.6}>
										<Text>Weekly</Text>
									</Pane>
									<Pane flex={0.4}>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>32.52450</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>%</Text>
												</Pane>
											</Pane>
										</Pane>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>2.13145</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>in $FARM</Text>
												</Pane>
											</Pane>
										</Pane>
										<Pane display="flex">
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-end">
													<Text>325.00145</Text>
												</Pane>
											</Pane>
											<Pane flex={0.5}>
												<Pane display="flex" justifyContent="flex-start">
													<Text marginLeft={minorScale(1)} opacity={0.55}>in $USD</Text>
												</Pane>
											</Pane>
										</Pane>
									</Pane>
								</Pane>							 
							</Pane> */}

							{/* Right/Center Content */}
							<Pane paddingLeft={minorScale(9)}>

								{/* Pools */}
								<Pane>
									<Pane display="flex">
										<Pane flex={0.5}>
											<Heading size={400} marginTop="default" textTransform="uppercase">Pools participated</Heading>
											<Paragraph size={300} color="muted">These are the list pools that you have staked in.</Paragraph>
										</Pane>
										<Pane flex={0.5}>
											<Pane display="flex" justifyContent="flex-end">
												<Button appearance="primary" intent="success" iconAfter={CaretDownIcon}>Claim all rewards</Button>
											</Pane>
										</Pane>
									</Pane>

									{/* Pool List */}
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
											<Table.TextHeaderCell>
												APY	
											</Table.TextHeaderCell>												
										</Table.Head>
										<Table.Body height={"auto"}>	

											{this.state.positions.map( pos =>
												<Table.Row>
													<Table.TextCell>
														<Paragraph size={300}>{pos.name}</Paragraph>
														<Paragraph size={100} className={"muted"}>Deposit {pos.name}</Paragraph>
													</Table.TextCell>
													<Table.TextCell>
														<Paragraph size={300}>{pos.earnedRewards}</Paragraph>
														<Paragraph size={100} className={"muted"}>≈ 0</Paragraph>
													</Table.TextCell>
													<Table.TextCell>
														<Paragraph size={300}>{pos.unstakedBalance}</Paragraph>
													</Table.TextCell>
													<Table.TextCell>		
														<Paragraph size={300}>{pos.usdValueOf}</Paragraph>
													</Table.TextCell>
													<Table.TextCell isNumber>
														<Paragraph size={300}>{pos.percentOfPool}</Paragraph>
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
			</React.Fragment>
		);
	}
}

export default DashboardPage;
