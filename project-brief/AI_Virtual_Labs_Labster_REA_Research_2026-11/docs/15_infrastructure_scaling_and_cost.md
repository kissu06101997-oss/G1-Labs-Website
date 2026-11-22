# Deployment, load and operating-cost scenarios

**As of 22 November 2026 IST. Proposed workload and price comparator in USD/month.** A single classroom web shell and three on-device laboratory environments share APIs, hosted artifacts and a data plane. Normal lessons require no dedicated cloud GPU. Availability, vendor procurement, capacity and all assumed rates require validation. Estimates are pre-tax and exclude development/asset production, schools' devices/network, annual certification, legal/procurement and contract-specific rates.

```text
Classroom browser
  public host + public CDN -> signed manifest -> shell + immutable asset/model packs
  private API host -> WAF/rate policy -> load balancer -> stateless apps
      -> private relational writer -> transactional outbox -> report/analytics workers
      -> short-lived private report download
      -> approved science verification workers as needed
      -> optional quota-limited tutor gateway -> approved model endpoint
Private service telemetry -> bounded metrics + restricted security logs
Relational writer + private artifacts -> protected backups -> approved secondary India site
CI -> checks -> signed release -> staged canary -> atomic manifest promotion/rollback
```

Public assets and textbooks/imagery approved for distribution contain no student data. Host assets separate from authenticated learner and institution routes. No shared caching of private progress, results, exports or authorization headers. Product app shell, static previews and immutable room packs use hashes, ETags and content versions. Player offers explicit prefetch, warm-start reuse and a low-bandwidth tier. Active attempts pin experiment, model, content and renderer ABI, allowing a rollback without invalidating prior evidence. Local offline records are a scoped pending queue with clear state and retry. The server validates grants, revisions, membership and idempotency before confirmation and grading. Retain rollback assets and honor erase/expiry at sign-out on shared lab PCs.

Deploy apps stateless across two availability zones where service selection allows. Use Postgres for identity-limited educational data and accepted actions, partitioned by time with access scoped by tenant and indexed revision keys. Queue export/aggregate workloads through a transactional outbox. Stage old raw events in encrypted immutable private storage permitted by retention policy, retaining compact grade/checkpoint/provenance data for direct access. Rolling cumulative analytics use coarse school/grade aggregates, no vendor advertising or tracking. Allocate a minimal authorized SRE view, immutable dependency release, uptime probes on public catalog/launch fixtures, synthetic restore drills and school-specific help codes.

The costing comparator uses AWS public rates for CloudFront/S3 in India and Mumbai Lightsail equivalent resources. It does not select the live contract provider. Mumbai is listed for Lightsail and AWS lists Hyderabad as a separate region. Regional defense requires separate qualified replicated storage/compute and restore design. Lightsail databases do not allow instance access from a different AWS region. Treat DB snapshots or logical exports, backup domain/credentials, secondary region warm-up/service transfer, replication, cross-region networking and region-specific rates as procurement/load-test items. Do not count a same-region high availability replica as DR. Review service and government-specific hosting eligibility, outbound data locations and logs. NICSI/MeghRaj/empanelled equivalent is a procurement option. [PL-CF-PAY](https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/) [PL-S3-MUM](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/ap-south-1/index.json) [PL-LIGHTSAIL](https://aws.amazon.com/lightsail/pricing/) [PL-LIGHT-REGION](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-regions-and-availability-zones-in-amazon-lightsail.html) [PL-AWS-REGIONS](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html) [PL-LIGHT-DB](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-databases.html) [PL-NIC-CLOUD](https://nicsi.nic.in/nicsi/nicsi-cloud/)

## Rate and workload inputs

| Input | Low | Base | High |
|---|---:|---:|---:|
| DAU / registered, instructional day | 5% | 12% | 25% |
| Sessions / active learner | 1 | 1.15 | 1.35 |
| In-hour start fraction, busiest 60 minutes | 12% | 25% | 40% |
| Average minutes/session | 15 | 22 | 30 |
| MiB transferred per session after browser cache | 12 | 28 | 65 |
| CDN byte and request hit assumptions per asset stream | 96% | 90% | 78% |
| Static HTTPS requests/session | 15 | 25 | 45 |
| Private API requests per concurrent minute | 3 | 6 | 10 |
| Stored learning events/session, 0.001 MiB each | 18 | 35 | 65 |
| Tutor turns/session, output/input tokens per turn | 0, 180/900 | 0.5, 300/1,300 | 2, 550/2,200 |
| Daily report jobs per active learner | 0.004 | 0.012 | 0.035 |
| Tickets per active instructional day | 0.0001 | 0.00035 | 0.0008 |
| Handling hours/ticket | 0.35 | 0.5 | 0.75 |
| Base monthly staff hours for 10,000 + per-ticket hours | 30 | 100 | 240 |
| Staff blended USD/hour | 12 | 18 | 25 |
| Non-event objects and additional snapshot provision (GiB) | 25 / 20 | 65 / 55 | 180 / 140 |
| Observability allowance at 10,000 USD/month | 15 | 50 | 120 |
| Contingency on modeled subtotal | 10% | 15% | 20% |

- Price assumptions are US dollar public pay-as-you-go without discounts. CloudFront India edge viewer egress is first 1 TB free, next 9 TB USD 0.109/GB, next 40 TB 0.085, next 100 TB 0.082, next 350 TB 0.080 for tiers reached here. HTTPS USD 0.012/10,000 after first 10 million. S3-to-CloudFront transfer is waived for AWS origin fetches within the stated terms. India viewer egress still bills CDN edge to client on a hit. Apply allowance only if procurement confirms customer eligibility and no other workload consumes it. AWS flat-rate CDN comparison depends on allowances, features and contract.
- Mumbai S3 public price list publication 21 November 2026 UTC, AmazonS3 offer version 20261121172919. Standard storage first 51,200 GB-Mo USD 0.025/GB-Mo SKU USGUTP2JY23N9GH2. Tier 1 requests SKU UJ844B8DVMQUFJQP USD 0.000005/request, Tier 2 SKU SF3QQQMZGA3PPF33 USD 0.0000004/request.
- Lightsail public monthly list price proxies are 4 GiB IPv4 Linux app USD 24, 8 GiB report worker USD 44, load balancer USD 18, encrypted HA database tiers USD 60/120/230/490/980 (2/4/8/16/32 GiB memory), backup USD 0.05 per GB-month and disk USD 0.10 per allocated GB-month. Quote alternative equivalent regions and managed sizes near capacity. Compare guaranteed performance, logging and procurement terms. The cheapest managed database tier on the official sheet lacks data encryption and is excluded.
- AI benchmark uses public GPT-6 Luna standard short-context list rates USD 0.10 input and USD 0.50 output per million tokens, no cache discount assumed. This is a price index, with no model deployment, endpoint approval or India processing assumption. Include reasoning tokens in output estimates. Require authorized India or conforming processing where applicable. Implement per-school/learner quotas, routing, throttle and off switches. Both modes are fully operable with a curated non-LLM tutor.
- Cloudflare R2 Standard comparator USD 0.015/GB-month, USD 4.50/million class A, USD 0.36/million class B and zero Internet egress from R2 under the terms. Public docs list Asia-Pacific location hints but omit a public India jurisdiction option. Evaluate only eligible non-personal/public assets under contract, confirm logs/edge locality and services. This potential cost lever is excluded from the table. [PL-CF-PAY](https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/) [PL-CF-FLAT](https://aws.amazon.com/cloudfront/pricing/) [PL-S3-MUM](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/ap-south-1/index.json) [PL-LIGHTSAIL](https://aws.amazon.com/lightsail/pricing/) [PL-OPENAI-RATE](https://developers.openai.com/api/docs/models/gpt-6-luna) [PL-R2-RATE](https://developers.cloudflare.com/r2/pricing/) [PL-R2-LOC](https://developers.cloudflare.com/r2/reference/data-location/)

## Reproduction and interpretation

Use 22 instructional days per month. DAU = registered × fraction. Starts per day = DAU × sessions/active learner. Monthly sessions = starts per day × 22. Model peak concurrency = ceil(starts per day × peak-hour fraction × session length ÷ 60), assuming evenly spaced starts within that hour. Size for scheduled class-boundary spikes separately. Peak API RPS = ceil(concurrency × API requests/active minute / 60). Report jobs = ceil(DAU × 22 × report propensity per active instructional day). Schedule reports and rollout pushes outside class-start windows.

Viewer GiB = sessions × MiB per session / 1024. Approximate AWS GB/TB arithmetic by GiB/TiB tiers in this planning sheet. CDN asset requests = sessions × static request count. Billing bins are applied after the always-free assumptions. Origin fills = viewer GiB × (1 − CDN byte hit), origin requests = CDN requests × (1 − request hit). Monthly S3 costs = estimated stored GiB × storage rate + origin requests × Tier 2 + (reports + 3000 content/report maintenance operations + ceil(sessions/10,000) archive writes) × Tier 1. The origin GET proxy uses the asset stream and a low-volume report proxy. Private API requests, export download bytes, logs and health checks require independent metering in pilot.

Six-month working data estimate = max(40, ceil(monthly sessions × events/session × 0.001 MiB × 6 × 1.6 / 1024 + registered × 0.008 MiB / 1024)). Hot database = max(40, ceil(monthly sessions × events/session × 0.001 MiB × 1.6 × 1.15 / 1024 + registered × 0.008 MiB / 1024)). Event archive = ceil(5 months × monthly sessions × events/session × 0.001 MiB / 1024) before compression. Object input adds the archive to the non-event provision and 0.25 MiB/report estimate. This is a cost sizing retention assumption for selected data, subject to the approved data-specific legal schedule. Expiry, actual index and report size must be profiled. Rent snapshot bytes as the scenario-specific overhead plus 2× hot DB. An archive or separate disk contingency is modeled above 800 estimated hot GiB at the corresponding list rate. Off-region storage transfer and effective DR standby are unresolved. Before launch add awarded cross-region variation, support and contingency explicitly.

App nodes = max(2, ceil(peak API RPS / 120) + 1), pending measured per-node throughput. Workers = max(1, ceil(report jobs / 18,000)); DB estimates select the smallest provisional tier for each hot size bracket, not a performance finding. Labor = (base hours × (registered/10,000)^0.18 + ceil(DAU × 22 × ticket rate) × handle hours) × blended hourly rate. Observability = allowance × (registered/10,000)^0.45. Add infra, labor and reserve. AI = total turns × (input tokens × USD 0.10 + output tokens × USD 0.50) / 1,000,000. Amounts below are rounded, while the machine readable CSV keeps more digits. Rounding at billing-unit level may differ.

| Registered | Scenario | DAU | Peak concurrent | Reports/mo | Viewer GiB/mo | Infra incl. optional AI | Staff | Total incl. reserve |
|---:|---|---:|---:|---:|---:|---:|---:|---:|
| 10,000 | low | 500 | 15 | 44 | 129 | 191 | 368 | 615 |
| 10,000 | base | 1,200 | 127 | 317 | 830 | 233 | 1890 | 2441 |
| 10,000 | high | 2,500 | 675 | 1,926 | 4713 | 782 | 6825 | 9128 |
| 1,00,000 | low | 5,000 | 150 | 440 | 1289 | 247 | 591 | 922 |
| 1,00,000 | base | 12,000 | 1,265 | 3,168 | 8302 | 1181 | 3561 | 5453 |
| 1,00,000 | high | 25,000 | 6,750 | 19,251 | 47131 | 5761 | 17331 | 27711 |
| 10,00,000 | low | 50,000 | 1,500 | 4,400 | 12891 | 1554 | 1287 | 3124 |
| 10,00,000 | base | 1,20,000 | 12,650 | 31,680 | 83016 | 8679 | 12440 | 24286 |
| 10,00,000 | high | 2,50,000 | 67,500 | 1,92,501 | 471313 | 50970 | 96245 | 176658 |

At 1,000,000 in base, 3,036,000 sessions × 28 MiB yields about 83,016 GiB. Reducing session bytes by 25% saves roughly 20,754 GiB of viewer delivery at the applicable marginal tier (about USD 1,702 before reserve). A cache hit improvement from 90% to 95% halves modeled S3 origin GETs and fills, while CloudFront viewer egress stays tied to client bytes. At base, disabling the modeled 1,518,000 AI turns saves about USD 425 before reserve. Concentrating 40% of starts rather than 25% into the peak hour at the same activity raises peak-concurrency estimates by 60%, with workload effects distinct from total traffic. A 30-day calendar with the same active workload raises monthly volume by about 36% versus 22 teaching days. These are marginal comparisons, not a capacity promise.

Proposed SLOs to confirm with district and provider: 99.9% monthly launch/API availability excluding documented school ISP loss, p95 supported school link API journey below 400 ms server portion excluding reports, async reports with visible status, RPO ≤15 min and RTO ≤4 h for district pilot. Exercise the baseline and 2× peak launch bursts, slow/reconnecting last-mile, app-node failure, DB failover, signed-content rollback, cold rehydration, private report bursts, data deletion and tenant export. Capture network/firewall whitelist needs and use school timetable-scheduled CDN warming within contract. Establish district L1 triage and escalation before school enrollment. Scale from a small synthetic test and district cohort before claiming capacity for lakhs.
