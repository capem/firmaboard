import * as React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import * as d3 from 'd3';

// TODO: Django API Integration
// - Fetch analytics data with date range filtering
// - Implement data caching for performance
// - Endpoints needed:
//   * GET /api/analytics/power-yield?start_date={date}&end_date={date}
//   * GET /api/analytics/downtime
//   * GET /api/analytics/efficiency
//   * WebSocket: ws://domain/ws/analytics/live-updates/

interface ChartProps {
  data: { label: string; value: number }[];
  title: string;
  type: 'bar' | 'line';
}

const Chart: React.FC<ChartProps> = ({ data, title, type }) => {
  const ref = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = 500;
    const height = 300;
    svg.attr('width', width).attr('height', height);

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .nice()
      .range([innerHeight, 0]);

    g.append('g').call(d3.axisLeft(y));

    if (type === 'bar') {
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-40)')
        .style('text-anchor', 'end');

      g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.label) as number)
        .attr('y', (d) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d) => innerHeight - y(d.value))
        .attr('fill', '#3b82f6');
    } else if (type === 'line') {
      const line = d3
        .line<{ label: string; value: number }>()
        .x((d) => (x(d.label)! + x.bandwidth() / 2))
        .y((d) => y(d.value));

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', line as any);

      g.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => (x(d.label)! + x.bandwidth() / 2))
        .attr('cy', (d) => y(d.value))
        .attr('r', 4)
        .attr('fill', '#3b82f6');
    }
  }, [data, type]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <svg ref={ref} className="w-full"></svg>
    </div>
  );
};

export const Analytics: React.FC = () => {
  // TODO: Implement API hooks and date range filtering
  // const [dateRange, setDateRange] = React.useState({ start: null, end: null })
  // const { data: powerYieldData } = useQuery(['powerYield', dateRange], fetchPowerYieldData)
  // const { data: downtimeData } = useQuery('downtime', fetchDowntimeData)
  // useWebSocket('ws://domain/ws/analytics/live-updates/')

  const powerYieldData = [
    { label: 'Jan', value: 400 },
    { label: 'Feb', value: 600 },
    { label: 'Mar', value: 700 },
    { label: 'Apr', value: 500 },
    { label: 'May', value: 800 },
    { label: 'Jun', value: 750 },
    { label: 'Jul', value: 650 },
    { label: 'Aug', value: 700 },
    { label: 'Sep', value: 600 },
    { label: 'Oct', value: 550 },
    { label: 'Nov', value: 400 },
    { label: 'Dec', value: 300 },
  ];

  const downtimeData = [
    { label: 'Asset A', value: 50 },
    { label: 'Asset B', value: 30 },
    { label: 'Asset C', value: 20 },
    { label: 'Asset D', value: 60 },
    { label: 'Asset E', value: 10 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <Chart title="Energy Yield Over Time" type="line" data={powerYieldData} />
        </CardHeader>
        <CardContent>
          {/* Additional content can go here */}
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <Chart title="Downtime Analysis" type="bar" data={downtimeData} />
        </CardHeader>
        <CardContent>
          {/* Additional content can go here */}
        </CardContent>
      </Card>
    </div>
  );
}; 