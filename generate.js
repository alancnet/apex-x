const typeDefs = {
    String:   {isNumeric: false, literal: "'foo'"},
    Integer:  {isNumeric: true,  literal: '123'},
    Decimal:  {isNumeric: true,  literal: '(Decimal)123.45'},
    Double:   {isNumeric: true,  literal: '(Double)123.45'},
    Long:     {isNumeric: true,  literal: '2147483648L' },
    // Date:     {isNumeric: false, },
    // DateTime: {isNumeric: false},
    Boolean:  {isNumeric: false, literal: 'true' },
    SObject:  {isNumeric: false, literal: 'new Account()'},
    Id:       {isNumeric: false, literal: "'00300000003T2PGAA0'"}
}

const generate = (enabledTypes) => {

    const types = Object.entries(typeDefs)
    .filter(([pascal]) => enabledTypes.includes(pascal))
    .map(([pascal, props]) => Object.assign(props, {pascal}))

    const code = `
    /* Code generated at https://codepen.io/alancnet/pen/WmwXEq */
    public class X {
    ${types.map(({pascal}) => `
        public class ${pascal}Iterator implements Iterator<${pascal}> {
            private List<${pascal}[]> values;
            private Integer length;
            private Integer index;
            private Integer listIndex;
            private Integer listSize;
            private Integer subIndex;
            private ${pascal}[] currentList;
            public ${pascal}Iterator(List<${pascal}[]> values) {
                this.values = values;
                length = 0;
                for (${pascal}[] l : values) {
                    length += l.size();
                }
                this.index = 0;
                listIndex = 0;
                listSize = 0;
                subIndex = 0;
            }
            public Boolean hasNext() { return index < length; }
            public ${pascal} next() {
                if (subIndex >= listSize) {
                    currentList = values[listIndex++];
                    listSize = currentList.size();
                    subIndex = 0;
                    return next();
                }
                index++;
                return currentList[subIndex++];
            }
        }
        public class Of${pascal} implements Iterable<${pascal}> {
            public Iterator<${pascal}> iterator() { return new ${pascal}Iterator(values); }
            private List<${pascal}[]> values;
            private Of${pascal}(List<${pascal}[]> values) {
                if (values == null) this.values = new List<${pascal}[]>();
                else this.values = values;
            }
            public Of${pascal}(${pascal}[] values) {
                if (values == null) this.values = new List<${pascal}[]>();
                else this.values = new List<${pascal}[]> { values };
            }
            public Of${pascal} filter(${pascal}Predicate predicate) {
                ${pascal}[] ret = new ${pascal}[0];
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (predicate.apply(value)) ret.add(value);
                }
                return new Of${pascal}(ret);
            }
    ${types.map(({pascal:other}) => `
            public Of${other} mapTo(${pascal}To${other} mapper) {
                ${other}[] ret = new ${other}[0];
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    ret.add(mapper.apply(value));
                }
                return new Of${other}(ret);
            }
    ${pascal === 'SObject' ? `
            public Map<${other}, SObject> toMap(${other}Selector selector) {
                Map<${other}, SObject> ret = new Map<${other}, SObject>();
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (value == null) continue;
                    ret.put(selector.apply(value), value);
                }
                return ret;
            }
            public Map<${other}, SObject> toMapBy${other}(String field) {
                Map<${other}, SObject> ret = new Map<${other}, SObject>();
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (value == null) continue;
                    ret.put((${other})value.get(field), value);
                }
                return ret;
            }
            public Map<${other}, SObject> toMapBy${other}(Schema.SObjectField field) {
                Map<${other}, SObject> ret = new Map<${other}, SObject>();
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (value == null) continue;
                    ret.put((${other})value.get(field), value);
                }
                return ret;
            }
            public Map<${other}, SObject[]> groupBy(${other}Selector selector) {
                Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (value == null) continue;
                    ${other} key = (${other})selector.apply(value);
                    if (!ret.containsKey(key)) ret.put(key, new ${pascal}[0]);
                    ret.get(key).add(value);
                }
                return ret;
            }
            public Map<${other}, SObject[]> groupBy${other}(Schema.SObjectField field) {
                Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (value == null) continue;
                    ${other} key = (${other})value.get(field);
                    if (!ret.containsKey(key)) ret.put(key, new ${pascal}[0]);
                    ret.get(key).add(value);
                }
                return ret;
            }
            public Map<${other}, SObject[]> groupBy${other}(String field) {
                Map<${other}, SObject[]> ret = new Map<${other}, SObject[]>();
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (value == null) continue;
                    ${other} key = (${other})value.get(field);
                    if (!ret.containsKey(key)) ret.put(key, new ${pascal}[0]);
                    ret.get(key).add(value);
                }
                return ret;
            }

            public Of${other} pluck${other}(String field) {
                ${other}[] ret = new ${other}[0];
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    ret.add((${other})value.get(field));
                }
                return new Of${other}(ret);
            }
            public Of${other} pluck${other}(Schema.SObjectField field) {
                ${other}[] ret = new ${other}[0];
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    ret.add((${other})value.get(field));
                }
                return new Of${other}(ret);
            }
    `:''}
    `).join('\n')}
            public ${pascal} reduce(${pascal}Reducer reducer) {
                ${pascal} accumulator;
                Integer length = size();
                Integer index = 0;
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (index++ == 0) {
                        accumulator = value;
                    } else {
                        accumulator = reducer.apply(accumulator, value);
                    }
                }
                return accumulator;
            }
            public Of${pascal} slice(Integer start, Integer finish) {
                if (start < 0) start = size() + start;
                if (finish < 0) finish = size() + finish;
                ${pascal}[] ret = new ${pascal}[0];
                for (${pascal}[] l : values) {
                    if (start > l.size()) {
                        start -= l.size();
                        finish -= l.size();
                        if (finish < 0) break;
                    } else {
                        for (Integer i = Math.max(0, start); i < finish && i < l.size(); i++) {
                            ret.add(l[i]);
                        }
                        start -= l.size();
                        finish -= l.size();
                    }
                }
                return new Of${pascal}(ret);
            }
            public Of${pascal} slice(Integer start) { return slice(start, size()); }
            public Of${pascal} distinct() { return new Of${pascal}(new List<${pascal}>(toSet())); }
            public Of${pascal} notNull() {
                ${pascal}[] ret = new ${pascal}[0];
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    if (value != null) ret.add(value);
                }
                return new Of${pascal}(ret);
            }
            public Integer size() {
                Integer length = 0;
                for (${pascal}[] l : values) {
                    length += l.size();
                }
                return length;
            }
            public Set<${pascal}> toSet() {
                Set<${pascal}> ret = new Set<${pascal}>();
                for (${pascal}[] l : values) {
                    ret.addAll(l);
                }
                return ret;
            }
            public List<${pascal}> toList() {
                ${pascal}[] ret = new ${pascal}[0];
                for (${pascal}[] l : values) {
                    ret.addAll(l);
                }
                return ret;
            }
            public List<${pascal}[]> getValues() { return values; }
            public ${pascal} first() { return get(0); }
            public ${pascal} last() { return get(size() - 1); }
            public String join(String separator) { return String.join(this, separator); }
            public String join() { return join(','); }
            public ${pascal} get(Integer index) {
                for (${pascal}[] l : values) {
                    if (index > l.size()) {
                        index -= l.size();
                    } else {
                        return l[index];
                    }
                }
                return null;
            }
            public Of${pascal} union(Of${pascal} other) { return union(other.values); }
            public Of${pascal} union(${pascal}[] other) { return union(new List<${pascal}[]> { other }); }
            private Of${pascal} union(List<${pascal}[]> other) {
                List<${pascal}[]> newList = new List<${pascal}[]>();
                newList.addAll(values);
                newList.addAll(other);
                return new Of${pascal}(newList);
            }
            public Of${pascal} add(${pascal} value) { values[values.size() -1].add(value); return this; }
            public Of${pascal} addAll(${pascal}[] other) { values.add(other); return this; }
            public Of${pascal} addAll(Set<${pascal}> other) { values[values.size() -1].addAll(other); return this; }

    ${pascal === 'SObject' ? `
            public Map<Id, SObject> toMap() {
                Map<Id, SObject> ret = new Map<Id, SObject>();
                Iterator<${pascal}> iter = iterator();
                while (iter.hasNext()) {
                    ${pascal} value = iter.next();
                    ret.put(value.Id, value);
                }
                return ret;
            }
    ` : ''}

        }
        public static Of${pascal} of(${pascal}[] values) { return new Of${pascal}(values); }
        public static Of${pascal} of(Set<${pascal}> values) { return new Of${pascal}(new List<${pascal}>(values)); }
        public static Of${pascal} of(Of${pascal} values) { return values; }
        public interface ${pascal}Predicate { Boolean apply(${pascal} value); }
        public interface ${pascal}Reducer { ${pascal} apply(${pascal} a, ${pascal} b); }
        public interface ${pascal}Selector { ${pascal} apply(SObject value); }
        public interface ${pascal}Mapper extends X.${pascal}To${pascal} { }
    ${types.map(({pascal:other}) => `
        public interface ${pascal}To${other} { ${other} apply(${pascal} value); }
    `).join('')}
    `).join('')}
    }
    `.trim()

    const tests = `
    /* Code generated at https://codepen.io/alancnet/pen/MxYaWE */
    @IsTest
    public class X_Tests {

        @isTest static void tests() {
            X.OfInteger ints = X.Of(new Integer[] {1,2,3});
            ints.addAll(new Integer[] {4,5});

            System.assertEquals('1,2,3,4,5', ints.join());
            System.assertEquals('2,3,4', ints.slice(1, -1).join());
            System.assertEquals(1, ints.first());
            System.assertEquals(5, ints.last());
            System.assertEquals(5, ints.size());
            ints = ints.union(ints);
            System.assertEquals('1,2,3,4,5,1,2,3,4,5', ints.join());
            ints = ints.distinct();
            System.assertEquals('1,2,3,4,5', ints.join());
            ints.add(null);
            System.assertEquals('1,2,3,4,5,', ints.join());
            ints = ints.notNull().mapTo(new AddMapper(-3));
            System.assertEquals('-2,-1,0,1,2', ints.join());
            ints = ints.filter(new PositiveFilter());
            System.assertEquals('0,1,2', ints.join());
        }
        private class AddMapper implements X.IntegerMapper {
            integer val;
            public AddMapper(Integer value) {
                this.val = value;
            }
            public Integer apply(Integer value) {
                return val + value;
            }
        }
        private class PositiveFilter implements X.IntegerPredicate {
            public Boolean apply(Integer value) {
                return value >= 0;
                }
        }

        @isTest
        public static void coverage() {
    ${types.map(({pascal, literal}) => `
          X.Of${pascal} a${pascal} = X.of(new ${pascal}[] { ${literal}, ${literal}, ${literal} });
          X.of(a${pascal}.toSet());
          X.of(a${pascal});
          a${pascal}.addAll(a${pascal}.toSet());
          a${pascal}.get(5);
          a${pascal}.get(50);
          a${pascal}.toList();
          a${pascal}.getValues();
          a${pascal}.slice(1);
          a${pascal}.slice(50);
          a${pascal}.slice(-1);
          a${pascal}.slice(1, -1);
          a${pascal}.slice(-1, 1);
          a${pascal}.size();
          a${pascal}.distinct();
          a${pascal}.notNull();
          a${pascal}.first();
          a${pascal}.last();
          a${pascal}.join();
          a${pascal}.union(new ${pascal}[0]);
          a${pascal}.union(a${pascal});
          X.Of${pascal} b${pascal} = a${pascal}.union(a${pascal});
          b${pascal}.add(${literal});
          b${pascal}.addAll(new ${pascal}[0]);
          b${pascal}.addAll(new Set<${pascal}>());
          a${pascal}.filter(new Test${pascal}Predicate());
          a${pascal}.reduce(new Test${pascal}Reducer());
    ${types.map(({pascal:other, literal:otherLiteral}) => `
          a${pascal}.mapTo(new Test${pascal}To${other}());
    `).join('')}
    `).join('')}
    ${types.map(({pascal, literal}) => `
          aSObject.pluck${pascal}('Name');
          aSObject.pluck${pascal}(Schema.Account.Name);
          aSObject.groupBy${pascal}('Name');
          aSObject.groupBy${pascal}(Schema.Account.Name);
          aSObject.groupBy(new Test${pascal}Selector());
          aSObject.toMapBy${pascal}('Name');
          aSObject.toMapBy${pascal}(Schema.Account.Name);
          aSObject.toMap(new Test${pascal}Selector());
    `).join('')}
          aSObject.toMap();
        }
    ${types.flatMap(({pascal, literal}) => `
        private class Test${pascal}Predicate implements X.${pascal}Predicate { public Boolean apply(${pascal} value) { return true; }}
        private class Test${pascal}Reducer implements X.${pascal}Reducer { public ${pascal} apply(${pascal} a, ${pascal} b) { return a; }}
        private class Test${pascal}Selector implements X.${pascal}Selector { public ${pascal} apply(SObject value) { return ${literal}; }}
    `).join('')}
    ${types.flatMap(({pascal, literal}) => types.map(({pascal:other, literal:otherLiteral}) => `
        private class Test${pascal}To${other} implements X.${pascal}To${other} { public ${other} apply(${pascal} value) { return ${otherLiteral}; }}
    `)).join('')}
    }
    `.trim()
    return {
        code: code.split('\n').map(x => x.substr(4).trimEnd()).filter(x => x).join('\n'),
        tests: tests.split('\n').map(x => x.substr(4).trimEnd()).filter(x => x).join('\n')
    }
}
