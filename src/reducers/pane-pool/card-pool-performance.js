// Profit performance
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