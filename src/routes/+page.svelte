<script>
  import FluentNumberSymbol16Filled from '~icons/fluent/number-symbol-16-filled';
  import Fa6SolidSackDollar from '~icons/fa6-solid/sack-dollar';
  import FaSolidDivide from '~icons/fa-solid/divide';
  import MingcuteBillFill from '~icons/mingcute/bill-fill';
  import PhPlayFill from '~icons/ph/play-fill';
  import GravityUiPercent from '~icons/gravity-ui/percent'

  const invalidNums = [null, undefined, 0, Infinity, NaN, ''];

  $: bill = null;
  $: billTotal = null;
  $: fromDate = null;
  $: throughDate = null;
  $: output = null;


  let checked = 'checked';
  $: splitTimes = null;
  $: isEvenSplit = checked === 'checked';
  $: splitType = isEvenSplit ? 'Even' : 'Uneven' ;
  $: splitValue = ( billTotal / splitTimes );

  function generateOutput() {
    const formattedFromDate = new Date(fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedThroughDate = new Date(throughDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    output = `${bill} ${formattedFromDate} - ${formattedThroughDate}`;
    // return output;
  }
  $: if(fromDate !== null && throughDate !== null) {
    console.log('fromDate: ', fromDate)
    console.log('throughDate: ', throughDate)
    generateOutput();
  }

  $: copied = false;
  $: tooltip = 'Copy to Clipboard';
  $: tootltipColor = copied ? 'success' : 'info';


  function copyToClipboard(event) {
    navigator.clipboard.writeText(event.target.value);
    copied = true;
    tooltip = 'Copied!';
  }

  $: persons = [];
  $: totalTallied = 0;
  $: percentLeft = 100;

  function personPercent() {
    for (let i = 0; i < splitTimes; i++) {
      persons[i] = { 'percentage': null, 'amount': null };
    }
  }

  function updatePersonPercent(percentage, i) {
    console.log('i: ', i)
    persons[i]['percentage'] = percentage;
    console.log('percentage: ', percentage)
    percentLeft -= percentage;
    console.log('percentLeft: ', percentLeft)

    let amount = (billTotal * (percentage / 100));
    console.log('amount: ', amount)
    persons[i]['amount'] = amount;
    totalTallied += amount;
    console.log('totalTallied: ', totalTallied)
    console.log('persons[i]: ', persons[i])
    console.log('persons: ', persons)
    // totalTallied = persons.reduce((acc, person) => acc + person['amount'].toFixed(2), 0);
  }

  function updateSplitType() {
    checked = checked === undefined ? 'checked' : undefined;
    console.log('update to checked: ', checked)
    isEvenSplit = checked === 'checked';
    console.log('isEvenSplit: ', isEvenSplit)
    splitType = isEvenSplit ? 'Even' : 'Uneven' ;
    console.log('splitType: ', splitType)
    personPercent();
  }
</script>

<div class="prose">
  <h1 class="m-4 text-center">Split! The! Bill!</h1>

  <div class="flex flex-col items-center gap-2">
    <div class="label flex-col">
      <span class="self-start label-text-alt">What's this for?</span>
      <select class="select select-bordered w-full max-w-xs" bind:value={bill} required>
        <option>⚡️🔌💡</option>
        <option>🗑️🚮</option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label for="fromDate" class="input input-bordered flex items-center gap-2">Bill Start Date:
        <input type="date" class="grow" id="fromDate" placeholder="Bill Start Date" bind:value={fromDate} required/>
      </label>
      <label for="throughDate" class="input input-bordered flex items-center gap-2">Throuh Date:
        <input type="date" class="grow" id="throughDate" placeholder="Bill End Date" bind:value={throughDate} required/>
      </label>
    </div>

    {#if output !== null}
      <div class="tooltip tooltip-{tootltipColor}" data-tip={tooltip}>
        <div on:click={copyToClipboard} readonly>
            {output}
        </div>
      </div>
    {/if}

    <br>
    <div class="flex flex-col gap-2">
      <label for="billtotal" class="input input-bordered flex items-center gap-2">
        <Fa6SolidSackDollar class="w-4 h-4 opacity-70"/>
        <input type="number" step="0.01" id="billtotal" class="grow" placeholder="Bill Total" bind:value={billTotal} required/>
      </label>

      <label for="split" class="input input-bordered flex items-center gap-2">
        <FaSolidDivide class="w-4 h-4 opacity-70"/>
        <input type="number" id="split" class="grow" placeholder="# of People" bind:value={splitTimes} required/>
      </label>

      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">{splitType} Split</span>
          <input type="checkbox" class="toggle toggle-success" name="splitType" on:click={updateSplitType} bind:checked={checked}/>
        </label>
      </div>


      {#if isEvenSplit === false && splitType == 'Uneven'}
        {#each persons as _, i}
          <label for="person{i}Percent" class="input input-bordered flex items-center gap-2">
            <GravityUiPercent class="w-4 h-4 opacity-70"/>
            <input type="number" id="person{i}Percent" class="grow" placeholder="Person {i + 1} Percentage" bind:value={persons[i]['percentage']} required on:change={updatePersonPercent(persons[i]['percentage'], i)}/>
            {#if !invalidNums.includes(persons[i]['amount'])}
              <div class="label">
                <span class="label-text-alt">Person {i + 1} Owes: ${persons[i]['amount']}</span>
              </div>
            {/if}
          </label>
        {/each}

        <p class="text-warning">
          {#if percentLeft > 0}
            Percent Left: {percentLeft}%
          {/if}
          {#if totalTallied !== billTotal}
            Remaining: ${(billTotal - totalTallied).toFixed(2)}
          {/if}
        </p>
      {/if}

      {#if billTotal !== null && splitTimes !== null && !invalidNums.includes(billTotal) && !invalidNums.includes(splitTimes) && isEvenSplit === true}
        <p>Each person pays: ${splitValue.toFixed(2)}</p>
      {/if}
    </div>
  </div>

</div>

<style>
  /* Add styling here */
</style>
