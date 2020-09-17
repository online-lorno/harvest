// Pool card
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

                <Pane display="flex" marginBottom={minorScale(1)}>
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
                <Pane display="flex" marginBottom={minorScale(1)}>
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
                <Pane display="flex" marginBottom={minorScale(1)}>
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
                <Pane display="flex" marginBottom={minorScale(1)}>
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