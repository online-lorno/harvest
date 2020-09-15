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
	Label
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


const {ethers, utils} = harvest;

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
		totalValue: 0,
		totalRewards: 0,
		usdValue: 0
	}

	setProvider(provider) {
		provider = new ethers.providers.Web3Provider(provider);
		
		let signer;
		try {
		  signer = provider.getSigner();
		} catch (e) {console.log(e);};
		const manager = harvest.manager.PoolManager.allPastPools(signer ? signer : provider);
	
		this.setState({provider, signer, manager});
		
		console.log({provider, signer, manager});
		
		// get the user address
		signer.getAddress().then((address) => this.setState({address}));

		console.log(signer.getBalance());
		
	}
	
	connectMetamask() {	
		detectEthereumProvider().then((provider) => { window.ethereum.enable().then(() => this.setProvider(provider));
		});
	}
	

	async getBalances() {

		const man = PoolManager.allPastPools(this.state.provider);
		const summaries = await man.summary(this.state.address);
		const underlyings = await man.underlying(this.state.address, true);
		
		console.log(this.state.address);
		console.log(this.state.provider);
		console.log(this.state.summaries);

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
		  totalRewards: totalRewards.toString(),
		  totalValue: totalValue.toString(),
		  underlyings: aggregateUnderlyings
		};

		console.log(output);

		this.setState({ 
			underlyings: aggregateUnderlyings,
			totalValue: utils.prettyMoney(totalValue),
			totalRewards: utils.prettyMoney(totalRewards)
		});

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
									<Text color="#E0E0E0">...</Text>
									<Button appearance="primary" intent="success" iconBefore={DollarIcon} onClick={this.connectMetamask.bind(this)}>Connect Wallet</Button>
								</Pane>
							</Pane>
							<Button appearance="primary" intent="success" iconBefore={DollarIcon} onClick={this.connectMetamask.bind(this)}>Go to Harvest.finance</Button>
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
									<Heading size={900} marginBottom={majorScale(1)}>{this.state.totalValue}</Heading>
									<Pane>
										<Text size={500}>Total account value</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
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
									<Heading size={900} marginBottom={majorScale(1)}>1.000</Heading>
									<Pane>
										<Text size={500}>Staked $FARM</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
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
									<Heading size={900} marginBottom={majorScale(1)}>1.413</Heading>
									<Pane>
										<Text size={500}>Unstaked $FARM</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
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
							<Pane flex={0.3}>
								<Heading size={700} color="#1D8248" marginBottom={minorScale(3)}>🚜 Farms</Heading>
								<Paragraph color="#BDBDBD">Deposit stablecoins, LP tokens or FARM to learn FARM</Paragraph>

								<Paragraph marginY={majorScale(3)} textTransform="uppercase">Your overall farming stats</Paragraph>
								<Pane marginBottom={majorScale(6)}>
									
									<Pane marginBottom={majorScale(2)}>									
										<Paragraph>Unstaked Farm</Paragraph>
										<Label class="hf-number xl" size={700} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>1.5145</Label>
									</Pane>

									<Pane marginBottom={majorScale(2)}>		
										<Paragraph>Total Farm staked on Profit Sharing</Paragraph>
										<Label class="hf-number xl" size={700} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>2.5000</Label>
									</Pane>
									
									<Pane marginBottom={majorScale(2)}>	
										<Paragraph>$FARM earned</Paragraph>
										<Label class="hf-number xl" size={700} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>2.13145</Label>
									</Pane>
									
								</Pane>

								<Pane display="flex">
									<Paragraph marginBottom={majorScale(3)} marginRight={majorScale(1)} textTransform="uppercase">Current farming rate</Paragraph>
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
							</Pane>

							{/* Right Content */}
							<Pane flex={0.7} paddingLeft={minorScale(9)}>

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
									<Pane display="flex" flexWrap="wrap" marginTop={majorScale(3)}>
										{dataPools.map(pool => (
											<Pane key={`pool-${pool.id}`} flex="0 0 calc(33% - 8px)" margin={minorScale(1)}>
												<Pane
													elevation={1}
													width="100%"
													border="default"
													paddingX={majorScale(1)}
													paddingY={majorScale(2)}
												>
													<Pane
														display="flex"
														height={70}
														justifyContent="center"
														alignItems="center"
														flexDirection="column"
														marginBottom={minorScale(5)}
													>
														{pool.closed && <Badge color="neutral" isSolid textTransform="uppercase">Closed</Badge>}
														<Heading size={700} color="#1D8248">{pool.name}</Heading>
														<Text color="#BDBDBD">Deposit {pool.deposit}</Text>
														{pool.boost && <Pill color="green" isSolid textTransform="uppercase">{pool.boost_multiplier}x boost</Pill>}
													</Pane>

													<Pane display="flex" marginBottom={minorScale(3)}>
														<Pane flex={0.5}>
															<Pane display="flex">
																<Text color="#425A70">Your stake</Text>
															</Pane>
														</Pane>
														<Pane flex={0.5}>
															<Pane display="flex" justifyContent="flex-end">
																<Text>${pool.stake.toFixed(2)}</Text>
															</Pane>
														</Pane>
													</Pane>
													<Pane display="flex" marginBottom={minorScale(3)}>
														<Pane flex={0.5}>
															<Pane display="flex">
																<Text color="#425A70">Size in the farm</Text>
															</Pane>
														</Pane>
														<Pane flex={0.5}>
															<Pane display="flex" justifyContent="flex-end">
																<Text>{pool.size_in_farm.toFixed(3)}%</Text>
															</Pane>
														</Pane>
													</Pane>
													<Pane display="flex" marginBottom={minorScale(3)}>
														<Pane flex={0.5}>
															<Pane display="flex">
																<Text color="#425A70">Profitability</Text>
															</Pane>
														</Pane>
														<Pane flex={0.5}>
															<Pane display="flex" justifyContent="flex-end">
																<Text color="#219653">{pool.profitability}% APY</Text>
															</Pane>
														</Pane>
													</Pane>
													<Pane display="flex" marginBottom={minorScale(3)}>
														<Pane flex={0.5}>
															<Pane display="flex">
																<Text color="#425A70">Earnings</Text>
															</Pane>
														</Pane>
														<Pane flex={0.5}>
															<Pane display="flex" justifyContent="flex-end">
																<Text color="#219653">{`${pool.earnings_num ? `${pool.earnings_num} = ` : ''}$${pool.earnings_amount}`}</Text>
															</Pane>
														</Pane>
													</Pane>
												</Pane>
											</Pane>
										))}
									</Pane>
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
