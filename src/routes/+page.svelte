<script>
	import { afterUpdate } from 'svelte';
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
  $: isEvenSplit = true;
  $: splitType = 'Even';
  $: splitValue = ( billTotal / splitTimes );


  function generateOutput() {
    let timezoneOffset = new Date().getTimezoneOffset() * 60000;
    let unixFromTime = new Date(fromDate).getTime() + timezoneOffset;
    const formattedFromDate = new Date(unixFromTime).toDateString().split(' ').slice(1, 3).join(' ');

    let unixThroughTime = new Date(throughDate).getTime() + timezoneOffset;
    const formattedThroughDate = new Date(unixThroughTime).toDateString().split(' ').slice(1, 3).join(' ');

    output = `${bill} ${formattedFromDate} - ${formattedThroughDate}`;
  }
  $: if(fromDate !== null && throughDate !== null) {
    generateOutput();
  }

  $: copied = false;
  $: tooltip = 'Copy to Clipboard';
  $: tootltipColor = copied ? 'success' : 'info';

  function copyToClipboard(event) {
    navigator.clipboard.writeText(output);
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
    persons[i]['percentage'] = percentage;
    percentLeft -= percentage;

    let amount = (billTotal * (percentage / 100));
    persons[i]['amount'] = amount;
    totalTallied += amount;
  }

  function updateSplitType() {
    checked = (checked == '') ? 'checked' : '';
    isEvenSplit = checked === 'checked';
    splitType = isEvenSplit ? 'Even' : 'Uneven';
    personPercent();
  }

  afterUpdate(() => {
    let textarea = document.getElementsByTagName('textarea')[0];
    if (textarea) {
      textarea.value = output;
      textarea.value.trim();
    }
  })
</script>

<div class="container mx-auto prose">
  <h1 class="mx-4 my-8 text-center">Split! The! Bill!</h1>

  <div class="flex flex-col items-center gap-2">
    <div class="label flex-col">
      <span class="self-start label-text-alt">What's this for?</span>
      <select class="select select-bordered w-full max-w-xs" bind:value={bill} required>
        <option>⚡️🔌💡</option>
        <option>🗑️🚮</option>
        <option>⛽️🚗🛣️</option>
        <option>🍔🍟🍕</option>
        <option>🍺🍻🍷</option>
        <option>🤷‍♀️🤷🤷‍♂️</option>
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
      <div class="tooltip tooltip-{tootltipColor} p-4" data-tip={tooltip}>
        <textarea type="text" on:click={copyToClipboard} rows="1" class="w-60 text-center textarea textarea-bordered box-content h-min " readonly>
            {output.trim()}
        </textarea>
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
        <label class="label cursor-pointer flex justify-between items-center">
          <h2 class="label-text m-0 underline underline-offset-2">{splitType} Split</h2>
          <input type="checkbox" class="toggle toggle-success" name="splitType" on:click={updateSplitType} bind:checked={checked}/>
        </label>
      </div>


      {#if (isEvenSplit === false) && (splitType === 'Uneven')}
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

        <div class="text-warning">
          {#if percentLeft > 0}
            <div>Percent Left: {percentLeft}%</div>
          {/if}
          {#if totalTallied !== billTotal}
            <div>Remaining: ${(billTotal - totalTallied).toFixed(2)}</div>
          {/if}
        </div>
      {/if}

      {#if billTotal !== null && splitTimes !== null && !invalidNums.includes(billTotal) && !invalidNums.includes(splitTimes) && isEvenSplit === true}
        <p>Each person pays: ${splitValue.toFixed(2)}</p>
      {/if}
    </div>
  </div>

</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .textarea {
    min-height: 1rem;
  }
</style>
