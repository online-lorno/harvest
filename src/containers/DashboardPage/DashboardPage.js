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
	minorScale
} from 'evergreen-ui';

import data from './../../data.json';
import ImageChart from './../../images/chart.png';
import GeneralHelper from './../../helpers/general';

export class DashboardPage extends Component {
	static propTypes = {
		reset: PropTypes.func.isRequired
	}

	state = {
		id: '0x4c8c2B98b7a7dA2EeAE60706E2646F8b10FA48af',
		// tabs
		selectedTabIndex: 1,
		tabs: ['Pool Performance', 'My Farms'],
		// pools
		selectedPool: null,
		pools: [{ text: 'All pools', value: '-' }].concat(data.pools.map(o => ({
			value: o.id,
			text: o.name
		})))
	}

	render() {
		const {
			id,
			selectedTabIndex,
			pools,
			selectedPool
		} = this.state;

		let dataPools = [];
		if (!selectedPool || selectedPool.value=== '-') {
			dataPools = data.pools;
		} else {
			dataPools = [data.pools.find(o => o.id === selectedPool.value)];
		}
		console.log({ dataPools });
		return (
			<React.Fragment>
				{/* Navigation */}
				<Pane display="flex" justifyContent="center" background="tint2" padding={majorScale(2)}>
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
				</Pane>

				{/* Dashboard Header */}
				<Pane display="flex" justifyContent="center" background="black" padding={majorScale(2)}>
					<Pane width={1200} display="flex">
						<Pane flex={0.4}>
							<Heading size={800} color="#F2C94C" marginBottom={majorScale(2)}>{GeneralHelper.ellipseId(id, 7)}</Heading>
							<Pane display="flex" marginBottom={majorScale(3)}>
								<Pane flex={0.6}>
									<Text color="#E0E0E0">You’re earning $1.93455 hourly thats $46.42851 daily and $325.00145 weekly</Text>
								</Pane>
							</Pane>
							<Button iconBefore={DollarIcon}>Withdraw All</Button>
						</Pane>
						<Pane flex={0.6}>
							<Pane display="flex" justifyContent="flex-end" marginBottom={majorScale(2)}>
								<Pane
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
									<Heading size={900} marginBottom={majorScale(1)}>$1.514k</Heading>
									<Pane>
										<Text size={500}>Your total staked in USD</Text>
										<ShareIcon marginLeft={minorScale(1)} />
									</Pane>
								</Pane>
								<Pane
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
						<Tablist marginBottom={16} flexBasis={240} marginRight={24}>
							{this.state.tabs.map((tab, index) => (
								<Tab
									key={tab}
									id={tab}
									onSelect={() => this.setState({ selectedTabIndex: index })}
									isSelected={index === selectedTabIndex}
									aria-controls={`panel-${tab}`}
								>
									{tab}
								</Tab>
							))}
						</Tablist>

						<Pane display="flex" marginTop={majorScale(6)}>
							{/* Left Content */}
							<Pane flex={0.3}>
								<Heading size={700} color="#1D8248" marginBottom={minorScale(3)}>🚜 Farms</Heading>
								<Paragraph color="#BDBDBD">Deposit stablecoins, LP tokens or FARM to learn FARM</Paragraph>

								<Paragraph marginY={majorScale(3)} textTransform="uppercase">Your overall farming stats</Paragraph>
								<Pane paddingLeft={majorScale(2)} marginBottom={majorScale(6)}>
									<Paragraph>Unstaked Farm</Paragraph>
									<Heading size={700} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>1.5145</Heading>

									<Paragraph>Total Farm staked on Profit sharing</Paragraph>
									<Heading size={700} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>2.5000</Heading>

									<Paragraph>Gain in %</Paragraph>
									<Heading size={700} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>32.52450</Heading>

									<Paragraph>$FARM Earned</Paragraph>
									<Heading size={700} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>2.13145</Heading>

									<Paragraph>Currrent Return in $</Paragraph>
									<Heading size={700} color="#219653" marginTop={majorScale(1)} marginBottom={majorScale(3)}>111,132,422,123,492.42093</Heading>
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
								{/* Chart */}
								<Pane marginBottom={majorScale(7)}>
									<Paragraph textTransform="uppercase">Farm earned overtime</Paragraph>
									<img src={ImageChart} alt="chart" style={{ width: '100%' }}/>
								</Pane>

								{/* Pools */}
								<Pane>
									<Pane display="flex">
										<Pane flex={0.5}>
											<Paragraph textTransform="uppercase">Pools participated</Paragraph>
											<Paragraph color="#BDBDBD">These are the list pools that you have staked in.</Paragraph>
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
											<Pane flex="0 0 calc(33% - 8px)" margin={minorScale(1)}>
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

												<Pane display="flex" paddingX={majorScale(2)} paddingY={majorScale(1)}>
													<Pane flex={0.4}>
														<Text color="#BDBDBD">Hourly</Text>
													</Pane>
													<Pane flex={0.6}>
														<Pane display="flex">
															<Pane flex={0.5}>
																<Pane display="flex" justifyContent="flex-end">
																	<Text>{pool.hourly.percentage}</Text>
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
																	<Text>{pool.hourly.farm}</Text>
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
																	<Text>{pool.hourly.usd}</Text>	
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
												<Pane display="flex" paddingX={majorScale(2)} paddingY={majorScale(1)}>
													<Pane flex={0.4}>
														<Text color="#BDBDBD">Daily</Text>
													</Pane>
													<Pane flex={0.6}>
														<Pane display="flex">
															<Pane flex={0.5}>
																<Pane display="flex" justifyContent="flex-end">
																	<Text>{pool.daily.percentage}</Text>
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
																	<Text>{pool.daily.farm}</Text>
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
																	<Text>{pool.daily.usd}</Text>
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
												<Pane display="flex" paddingX={majorScale(2)} paddingY={majorScale(1)}>
													<Pane flex={0.4}>
														<Text color="#BDBDBD">Weekly</Text>
													</Pane>
													<Pane flex={0.6}>
														<Pane display="flex">
															<Pane flex={0.5}>
																<Pane display="flex" justifyContent="flex-end">
																	<Text>{pool.weekly.percentage}</Text>
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
																	<Text>{pool.weekly.farm}</Text>
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
																	<Text>{pool.weekly.usd}</Text>
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
